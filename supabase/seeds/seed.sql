insert into markets (code,name,currency) values ('ES','Spain','EUR') on conflict do nothing;
insert into roles (name) values ('buyer'),('seller'),('realtor'),('photographer'),('lawyer'),('notary'),('admin') on conflict do nothing;
