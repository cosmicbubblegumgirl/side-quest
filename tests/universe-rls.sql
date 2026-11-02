begin;
insert into auth.users(id) values ('00000000-0000-4000-8000-000000000911'), ('00000000-0000-4000-8000-000000000912');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000911","role":"authenticated"}',true);
insert into public.sq_state(user_id,data) values (auth.uid(),'{"universe":{"version":1,"coins":30,"inventory":{"paper":3,"dust":2},"persona":{"name":"Disposable traveller"},"completed":{},"home":{"slots":["lamp",null,null,null,null,null]}}}'::jsonb);
do $$ begin
 if (select data->'universe'->>'coins' from public.sq_state where user_id=auth.uid()) <> '30' then raise exception 'World round trip failed'; end if;
end $$;
update public.sq_state set data=jsonb_set(data,'{universe,coins}','38'::jsonb) where user_id=auth.uid();
do $$ begin
 if (select data->'universe'->>'coins' from public.sq_state where user_id=auth.uid()) <> '38' then raise exception 'World update failed'; end if;
end $$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000912","role":"authenticated"}',true);
do $$ begin
 if exists(select 1 from public.sq_state where user_id='00000000-0000-4000-8000-000000000911') then raise exception 'Another user could read the universe'; end if;
 begin
 insert into public.sq_state(user_id,data) values ('00000000-0000-4000-8000-000000000911','{"universe":{"coins":999}}');
 raise exception 'Another user could write the universe';
 exception when insufficient_privilege then null; end;
end $$;
select 'PASS: universe JSON round trip, update and per-user isolation' as result;
rollback;
