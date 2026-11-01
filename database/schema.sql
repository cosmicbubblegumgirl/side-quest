-- SIDE QUEST. Separate tables preserve existing applications on this project.
create function public.sq_config_valid(c jsonb) returns boolean language plpgsql immutable security invoker set search_path='' as $$
declare x jsonb; y jsonb; n integer;
begin
 if jsonb_typeof(c)<>'object' or octet_length(c::text)>100000 then return false; end if;
 if c->>'type'='shifts' then
  if jsonb_typeof(c->'slots')<>'array' or jsonb_typeof(c->'people')<>'array' then return false; end if;
  n:=jsonb_array_length(c->'slots'); if n<1 or n>20 or jsonb_array_length(c->'people') not between 1 and 30 then return false; end if;
  if (select count(distinct v->>'id') from jsonb_array_elements(c->'slots') v)<>n then return false; end if;
  if (select count(distinct v->>'id') from jsonb_array_elements(c->'people') v)<>jsonb_array_length(c->'people') then return false; end if;
  for x in select value from jsonb_array_elements(c->'slots') loop
   if coalesce(length(x->>'id'),0)=0 or coalesce(length(x->>'name'),0)=0 or coalesce(length(x->>'subject'),0)=0 or (x->>'time')::numeric not between 0 and 100000 then return false; end if;
  end loop;
  for x in select value from jsonb_array_elements(c->'people') loop
   if coalesce(length(x->>'id'),0)=0 or coalesce(length(x->>'name'),0)=0 or jsonb_typeof(x->'skills')<>'array' or jsonb_typeof(x->'available')<>'array' or coalesce((x->>'max')::integer,0) not between 1 and 100000 then return false; end if;
  end loop;
 elsif c->>'type'='deliveries' then
  if jsonb_typeof(c->'stops')<>'array' or jsonb_typeof(c->'vehicles')<>'array' then return false; end if;
  n:=jsonb_array_length(c->'stops'); if n not between 1 and 20 or jsonb_array_length(c->'vehicles') not between 1 and 8 or coalesce((c->>'returnBy')::numeric,-1) not between 0 and 100000 then return false; end if;
  if (select count(distinct v->>'id') from jsonb_array_elements(c->'stops') v)<>n then return false; end if;
  if (select count(distinct v->>'id') from jsonb_array_elements(c->'vehicles') v)<>jsonb_array_length(c->'vehicles') then return false; end if;
  for x in select value from jsonb_array_elements(c->'stops') loop
   if coalesce(length(x->>'id'),0)=0 or coalesce(length(x->>'name'),0)=0 or not (x ?& array['qty','x','y','open','close','service','cold']) then return false; end if;
   if (x->>'qty')::numeric not between 0 and 100000 or (x->>'x')::numeric not between 0 and 100000 or (x->>'y')::numeric not between 0 and 100000 or (x->>'open')::numeric not between 0 and 100000 or (x->>'close')::numeric not between (x->>'open')::numeric and 100000 or (x->>'service')::numeric not between 0 and 100000 or jsonb_typeof(x->'cold')<>'boolean' then return false; end if;
  end loop;
  for x in select value from jsonb_array_elements(c->'vehicles') loop
   if coalesce(length(x->>'id'),0)=0 or coalesce(length(x->>'name'),0)=0 or coalesce((x->>'capacity')::numeric,-1) not between 0 and 100000 or jsonb_typeof(x->'cold')<>'boolean' then return false; end if;
  end loop;
 elsif c->>'type'='packs' then
  if jsonb_typeof(c->'kits')<>'array' or jsonb_typeof(c->'items')<>'array' then return false; end if;
  n:=jsonb_array_length(c->'kits'); if n not between 1 and 20 or jsonb_array_length(c->'items') not between 1 and 10 or coalesce((c->>'maxWeight')::numeric,-1) not between 0 and 100000 or coalesce((c->>'fairness')::numeric,-1) not between 0 and 100000 then return false; end if;
  if (select count(distinct v->>'id') from jsonb_array_elements(c->'kits') v)<>n then return false; end if;
  if (select count(distinct v->>'id') from jsonb_array_elements(c->'items') v)<>jsonb_array_length(c->'items') then return false; end if;
  for x in select value from jsonb_array_elements(c->'items') loop
   if coalesce(length(x->>'id'),0)=0 or coalesce(length(x->>'name'),0)=0 or not (x ?& array['min','stock','weight']) or (x->>'min')::numeric not between 0 and 100000 or (x->>'stock')::numeric not between 0 and 100000 or (x->>'weight')::numeric not between 0 and 100000 then return false; end if;
  end loop;
 else return false; end if;
 return true;
exception when others then return false;
end $$;

create function public.sq_plan_valid(c jsonb,p jsonb) returns boolean language plpgsql immutable security invoker set search_path='' as $$
declare s jsonb; v jsonb; k jsonb; it jsonb; sid text; vid text; rid jsonb; seen text[]:=array[]::text[]; used integer; total numeric; mn numeric; mx numeric; val numeric; x numeric; y numeric; tm numeric; weight numeric;
begin
 if not public.sq_config_valid(c) or jsonb_typeof(p)<>'object' or octet_length(p::text)>100000 then return false; end if;
 if c->>'type'='shifts' then
  if jsonb_typeof(p->'assignments')<>'object' then return false; end if;
  for s in select value from jsonb_array_elements(c->'slots') loop
   vid:=p->'assignments'->>(s->>'id');
   select value into v from jsonb_array_elements(c->'people') where value->>'id'=vid;
   if v is null or not (v->'skills' ? (s->>'subject')) or not (v->'available' ? (s->>'id')) then return false; end if;
  end loop;
  for v in select value from jsonb_array_elements(c->'people') loop
   select count(*),count(distinct q->>'time') into used,total from jsonb_array_elements(c->'slots') q where p->'assignments'->>(q->>'id')=v->>'id';
   if used>(v->>'max')::integer or used<>total then return false; end if;
  end loop;
 elsif c->>'type'='deliveries' then
  if jsonb_typeof(p->'routes')<>'object' then return false; end if;
  for v in select value from jsonb_array_elements(c->'vehicles') loop
   rid:=p->'routes'->(v->>'id'); if jsonb_typeof(rid)<>'array' or jsonb_array_length(rid)>jsonb_array_length(c->'stops') then return false; end if;
   x:=0;y:=0;tm:=0;total:=0;
   for sid in select jsonb_array_elements_text(rid) loop
    if sid=any(seen) then return false; end if; seen:=array_append(seen,sid);
    select value into s from jsonb_array_elements(c->'stops') where value->>'id'=sid;
    if s is null then return false; end if;
    tm:=tm+ceil(sqrt(power(x-(s->>'x')::numeric,2)+power(y-(s->>'y')::numeric,2))*2);
    tm:=greatest(tm,(s->>'open')::numeric);
    if tm>(s->>'close')::numeric or ((s->>'cold')::boolean and not (v->>'cold')::boolean) then return false; end if;
    tm:=tm+(s->>'service')::numeric;x:=(s->>'x')::numeric;y:=(s->>'y')::numeric;total:=total+(s->>'qty')::numeric;
   end loop;
   tm:=tm+ceil(sqrt(x*x+y*y)*2);
   if tm>(c->>'returnBy')::numeric or total>(v->>'capacity')::numeric then return false; end if;
  end loop;
  if cardinality(seen)<>jsonb_array_length(c->'stops') then return false; end if;
 elsif c->>'type'='packs' then
  if jsonb_typeof(p->'packs')<>'object' then return false; end if;
  for it in select value from jsonb_array_elements(c->'items') loop
   total:=0;mn:=1000000000;mx:=0;
   for k in select value from jsonb_array_elements(c->'kits') loop
    val:=(p->'packs'->(k->>'id')->>(it->>'id'))::numeric;
    if val is null or val<>trunc(val) or val<(it->>'min')::numeric then return false; end if;
    total:=total+val;mn:=least(mn,val);mx:=greatest(mx,val);
   end loop;
   if total>(it->>'stock')::numeric or mx-mn>(c->>'fairness')::numeric then return false; end if;
  end loop;
  for k in select value from jsonb_array_elements(c->'kits') loop
   weight:=0;
   for it in select value from jsonb_array_elements(c->'items') loop weight:=weight+(p->'packs'->(k->>'id')->>(it->>'id'))::numeric*(it->>'weight')::numeric; end loop;
   if weight>(c->>'maxWeight')::numeric then return false; end if;
  end loop;
 else return false; end if;
 return true;
exception when others then return false;
end $$;

create table public.sq_quests (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(length(title) between 1 and 100), organization text not null check(length(organization) between 1 and 100),
 brief text not null check(length(brief) between 1 and 3000), type text not null check(type in ('shifts','deliveries','packs')),
 difficulty integer not null default 0 check(difficulty between 0 and 3), config jsonb not null check(public.sq_config_valid(config) and config->>'type'=type),
 published boolean not null default false, created_at timestamptz not null default now()
);
create index sq_quests_owner on public.sq_quests(owner_id);
create index sq_quests_board on public.sq_quests(created_at desc) where published;
create table public.sq_submissions (
 id uuid primary key default gen_random_uuid(), quest_id uuid not null references public.sq_quests(id) on delete cascade,
 author_id uuid not null references auth.users(id) on delete cascade, plan jsonb not null,
 config_snapshot jsonb not null default '{}', notes text not null default '' check(length(notes)<=3000),
 created_at timestamptz not null default now(), check(octet_length(plan::text)<=100000)
);
create index sq_submissions_quest on public.sq_submissions(quest_id);
create index sq_submissions_author on public.sq_submissions(author_id);
create table public.sq_reviews (
 submission_id uuid primary key references public.sq_submissions(id) on delete cascade,
 reviewer_id uuid not null references auth.users(id) on delete cascade, decision text not null check(decision in ('approved','revision','declined','used')),
 note text not null check(length(note) between 1 and 3000), created_at timestamptz not null default now()
);
create index sq_reviews_reviewer on public.sq_reviews(reviewer_id);
create table public.sq_state (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null default '{}' check(jsonb_typeof(data)='object' and octet_length(data::text)<=2000000), updated_at timestamptz not null default now()
);
create function public.sq_fixed_quest() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if new.id<>old.id or new.owner_id<>old.owner_id or new.config<>old.config or new.type<>old.type then raise exception 'Quest constraints and ownership are fixed. Create a new quest for changed constraints.'; end if;
 return new;
end $$;
create trigger sq_fixed_quest before update on public.sq_quests for each row execute function public.sq_fixed_quest();
create function public.sq_check_submission() returns trigger language plpgsql security invoker set search_path='' as $$
declare c jsonb;
begin
 select config into c from public.sq_quests where id=new.quest_id and published;
 if c is null or not public.sq_plan_valid(c,new.plan) then raise exception 'The submitted plan must satisfy the published constraints.'; end if;
 new.config_snapshot:=c; return new;
end $$;
create trigger sq_check_submission before insert on public.sq_submissions for each row execute function public.sq_check_submission();
alter table public.sq_quests enable row level security;
alter table public.sq_submissions enable row level security;
alter table public.sq_reviews enable row level security;
alter table public.sq_state enable row level security;
create policy sq_public_briefs on public.sq_quests for select to anon,authenticated using(published or owner_id=(select auth.uid()));
create policy sq_owner_new on public.sq_quests for insert to authenticated with check(owner_id=(select auth.uid()));
create policy sq_owner_edit on public.sq_quests for update to authenticated using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
create policy sq_plan_read on public.sq_submissions for select to authenticated using(author_id=(select auth.uid()) or exists(select 1 from public.sq_quests q where q.id=quest_id and q.owner_id=(select auth.uid())));
create policy sq_plan_new on public.sq_submissions for insert to authenticated with check(author_id=(select auth.uid()) and exists(select 1 from public.sq_quests q where q.id=quest_id and q.published));
create policy sq_plan_withdraw on public.sq_submissions for delete to authenticated using(author_id=(select auth.uid()));
create policy sq_review_read on public.sq_reviews for select to authenticated using(exists(select 1 from public.sq_submissions s where s.id=submission_id));
create policy sq_review_new on public.sq_reviews for insert to authenticated with check(reviewer_id=(select auth.uid()) and exists(select 1 from public.sq_submissions s join public.sq_quests q on q.id=s.quest_id where s.id=submission_id and q.owner_id=(select auth.uid())));
create policy sq_review_edit on public.sq_reviews for update to authenticated using(reviewer_id=(select auth.uid())) with check(reviewer_id=(select auth.uid()) and exists(select 1 from public.sq_submissions s join public.sq_quests q on q.id=s.quest_id where s.id=submission_id and q.owner_id=(select auth.uid())));
create policy sq_state_read on public.sq_state for select to authenticated using(user_id=(select auth.uid()));
create policy sq_state_new on public.sq_state for insert to authenticated with check(user_id=(select auth.uid()));
create policy sq_state_edit on public.sq_state for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy sq_state_delete on public.sq_state for delete to authenticated using(user_id=(select auth.uid()));
revoke all on public.sq_quests,public.sq_submissions,public.sq_reviews,public.sq_state from anon,authenticated;
grant select on public.sq_quests to anon;
grant select,insert,update on public.sq_quests to authenticated;
grant select,insert,delete on public.sq_submissions to authenticated;
grant select,insert,update on public.sq_reviews to authenticated;
grant select,insert,update,delete on public.sq_state to authenticated;
