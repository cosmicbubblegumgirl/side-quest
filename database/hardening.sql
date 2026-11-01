-- SIDE QUEST. Separate tables preserve existing applications on this project.
create or replace function public.sq_config_valid(c jsonb) returns boolean language plpgsql immutable security invoker set search_path='' as $$
declare x jsonb; y jsonb; n integer;
begin
 if c is null or jsonb_path_exists(c,'$.** ? (@ == null)') or jsonb_typeof(c)<>'object' or octet_length(c::text)>100000 then return false; end if;
 if c->>'type'='shifts' then
  if jsonb_typeof(c->'slots')<>'array' or jsonb_typeof(c->'people')<>'array' then return false; end if;
  n:=jsonb_array_length(c->'slots'); if n<1 or n>20 or jsonb_array_length(c->'people') not between 1 and 30 then return false; end if;
  if (select count(distinct v->>'id') from jsonb_array_elements(c->'slots') v)<>n then return false; end if;
  if (select count(distinct v->>'id') from jsonb_array_elements(c->'people') v)<>jsonb_array_length(c->'people') then return false; end if;
  for x in select value from jsonb_array_elements(c->'slots') loop
   if coalesce(length(x->>'id'),0)=0 or coalesce(length(x->>'name'),0)=0 or coalesce(length(x->>'subject'),0)=0 or not (x ?& array['id','name','subject','time']) or jsonb_typeof(x->'time')<>'number' or (x->>'time')::numeric not between 0 and 100000 then return false; end if;
  end loop;
  for x in select value from jsonb_array_elements(c->'people') loop
   if coalesce(length(x->>'id'),0)=0 or coalesce(length(x->>'name'),0)=0 or not (x ?& array['id','name','skills','available','max']) or jsonb_typeof(x->'max')<>'number' or jsonb_typeof(x->'skills')<>'array' or jsonb_typeof(x->'available')<>'array' or coalesce((x->>'max')::integer,0) not between 1 and 100000 then return false; end if;
  end loop;
 elsif c->>'type'='deliveries' then
  if jsonb_typeof(c->'stops')<>'array' or jsonb_typeof(c->'vehicles')<>'array' then return false; end if;
  if jsonb_typeof(c->'returnBy') is distinct from 'number' then return false; end if;
  n:=jsonb_array_length(c->'stops'); if n not between 1 and 20 or jsonb_array_length(c->'vehicles') not between 1 and 8 or coalesce((c->>'returnBy')::numeric,-1) not between 0 and 100000 then return false; end if;
  if (select count(distinct v->>'id') from jsonb_array_elements(c->'stops') v)<>n then return false; end if;
  if (select count(distinct v->>'id') from jsonb_array_elements(c->'vehicles') v)<>jsonb_array_length(c->'vehicles') then return false; end if;
  for x in select value from jsonb_array_elements(c->'stops') loop
   if coalesce(length(x->>'id'),0)=0 or coalesce(length(x->>'name'),0)=0 or not (x ?& array['qty','x','y','open','close','service','cold']) then return false; end if;
   if exists(select 1 from jsonb_each(x) e where e.key in ('qty','x','y','open','close','service') and jsonb_typeof(e.value)<>'number') then return false; end if;
   if (x->>'qty')::numeric not between 0 and 100000 or (x->>'x')::numeric not between 0 and 100000 or (x->>'y')::numeric not between 0 and 100000 or (x->>'open')::numeric not between 0 and 100000 or (x->>'close')::numeric not between (x->>'open')::numeric and 100000 or (x->>'service')::numeric not between 0 and 100000 or jsonb_typeof(x->'cold')<>'boolean' then return false; end if;
  end loop;
  for x in select value from jsonb_array_elements(c->'vehicles') loop
   if coalesce(length(x->>'id'),0)=0 or coalesce(length(x->>'name'),0)=0 or jsonb_typeof(x->'capacity') is distinct from 'number' or coalesce((x->>'capacity')::numeric,-1) not between 0 and 100000 or jsonb_typeof(x->'cold')<>'boolean' then return false; end if;
  end loop;
 elsif c->>'type'='packs' then
  if jsonb_typeof(c->'kits')<>'array' or jsonb_typeof(c->'items')<>'array' then return false; end if;
  if jsonb_typeof(c->'maxWeight') is distinct from 'number' or jsonb_typeof(c->'fairness') is distinct from 'number' then return false; end if;
  for x in select value from jsonb_array_elements(c->'kits') loop
   if coalesce(length(x->>'id'),0)=0 or coalesce(length(x->>'name'),0)=0 then return false; end if;
  end loop;
  n:=jsonb_array_length(c->'kits'); if n not between 1 and 20 or jsonb_array_length(c->'items') not between 1 and 10 or coalesce((c->>'maxWeight')::numeric,-1) not between 0 and 100000 or coalesce((c->>'fairness')::numeric,-1) not between 0 and 100000 then return false; end if;
  if (select count(distinct v->>'id') from jsonb_array_elements(c->'kits') v)<>n then return false; end if;
  if (select count(distinct v->>'id') from jsonb_array_elements(c->'items') v)<>jsonb_array_length(c->'items') then return false; end if;
  for x in select value from jsonb_array_elements(c->'items') loop
   if exists(select 1 from jsonb_each(x) e where e.key in ('min','stock','weight') and jsonb_typeof(e.value)<>'number') then return false; end if;
   if coalesce(length(x->>'id'),0)=0 or coalesce(length(x->>'name'),0)=0 or not (x ?& array['min','stock','weight']) or (x->>'min')::numeric not between 0 and 100000 or (x->>'stock')::numeric not between 0 and 100000 or (x->>'weight')::numeric not between 0 and 100000 then return false; end if;
  end loop;
 else return false; end if;
 return true;
exception when others then return false;
end $$;

