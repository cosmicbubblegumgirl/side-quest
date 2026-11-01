begin;
insert into auth.users(id) values ('00000000-0000-4000-8000-000000000101'),('00000000-0000-4000-8000-000000000102'),('00000000-0000-4000-8000-000000000103');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000101","role":"authenticated"}',true);
insert into public.sq_quests(id,owner_id,title,organization,brief,type,config,published) values ('00000000-0000-4000-8000-000000000201',auth.uid(),'Disposable test brief','Test fixture','Disposable test only','packs','{"type": "packs", "level": 0, "seed": 19, "kits": [{"id": "k0", "name": "Learner pack 1"}, {"id": "k1", "name": "Learner pack 2"}, {"id": "k2", "name": "Learner pack 3"}], "items": [{"id": "i0", "name": "Notebooks", "min": 2, "stock": 10, "weight": 199}, {"id": "i1", "name": "Pencils", "min": 1, "stock": 4, "weight": 8}, {"id": "i2", "name": "Rulers", "min": 1, "stock": 7, "weight": 25}, {"id": "i3", "name": "Erasers", "min": 1, "stock": 6, "weight": 16}], "maxWeight": 1000, "fairness": 2}'::jsonb,true),('00000000-0000-4000-8000-000000000202',auth.uid(),'Disposable draft','Test fixture','Disposable test only','packs','{"type": "packs", "level": 0, "seed": 19, "kits": [{"id": "k0", "name": "Learner pack 1"}, {"id": "k1", "name": "Learner pack 2"}, {"id": "k2", "name": "Learner pack 3"}], "items": [{"id": "i0", "name": "Notebooks", "min": 2, "stock": 10, "weight": 199}, {"id": "i1", "name": "Pencils", "min": 1, "stock": 4, "weight": 8}, {"id": "i2", "name": "Rulers", "min": 1, "stock": 7, "weight": 25}, {"id": "i3", "name": "Erasers", "min": 1, "stock": 6, "weight": 16}], "maxWeight": 1000, "fairness": 2}'::jsonb,false);
do $$ begin if (select count(*) from public.sq_quests where id::text like '00000000-%')<>2 then raise exception 'Owner must see two own briefs'; end if; end $$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000102","role":"authenticated"}',true);
do $$ begin if (select count(*) from public.sq_quests where id::text like '00000000-%')<>1 then raise exception 'Player must see published brief only'; end if; end $$;
insert into public.sq_submissions(id,quest_id,author_id,plan) values ('00000000-0000-4000-8000-000000000301','00000000-0000-4000-8000-000000000201',auth.uid(),'{"packs": {"k0": {"i0": 2, "i1": 1, "i2": 1, "i3": 1}, "k1": {"i0": 2, "i1": 1, "i2": 1, "i3": 1}, "k2": {"i0": 2, "i1": 1, "i2": 1, "i3": 1}}}'::jsonb);
do $$ begin
 begin
 insert into public.sq_submissions(quest_id,author_id,plan) values ('00000000-0000-4000-8000-000000000201',auth.uid(),'{"packs":{}}');
 raise exception 'Invalid plan was accepted';
 exception when raise_exception then if sqlerrm='Invalid plan was accepted' then raise; end if; end;
end $$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000103","role":"authenticated"}',true);
do $$ begin
 if (select count(*) from public.sq_submissions where id='00000000-0000-4000-8000-000000000301')<>0 then raise exception 'Unrelated user can see plan'; end if;
 begin
 insert into public.sq_reviews(submission_id,reviewer_id,decision,note) values ('00000000-0000-4000-8000-000000000301',auth.uid(),'approved','Forged decision');
 raise exception 'Unauthorised review was accepted';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000101","role":"authenticated"}',true);
insert into public.sq_reviews(submission_id,reviewer_id,decision,note) values ('00000000-0000-4000-8000-000000000301',auth.uid(),'approved','Disposable test decision');
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000102","role":"authenticated"}',true);
do $$ begin if (select count(*) from public.sq_reviews where submission_id='00000000-0000-4000-8000-000000000301')<>1 then raise exception 'Author cannot see review'; end if; end $$;
select 'RLS: owner, author, unrelated user, invalid plan and review ownership checks passed' as result;
rollback;
