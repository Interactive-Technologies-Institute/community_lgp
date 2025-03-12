create table parameters (
    id serial primary key,
    type text not null,
    code text not null,
    name varchar(255),
    is_parent boolean not null, 
    parent text,
    children text[],
    image text
);