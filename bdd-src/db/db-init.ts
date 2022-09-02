export default `
create table users (
    id serial primary key,
    first_name varchar(100),
    last_name varchar(100),
    env text,
    created_date timestamp default now(),
    updated_date timestamp default now()
);

create table addresses (
    id serial primary key,
    user_id int8 constraint fk_addresses_users references users(id),
    address_text text not null,
    ip_address inet not null,
    ip_lat real,
    ip_lon real,
    address_lat real,
    address_lon real,
    processing boolean default false,
    processed  boolean default false,
    correct boolean,
    error text,
    env text default 'dev',
    created_date timestamp default now(),
    updated_date timestamp default now()
);
`;
