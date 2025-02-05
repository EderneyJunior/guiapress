create table articles(
	id int auto_increment primary key,
    title text not null,
    slug text not null,
    body text not null,
  	category_id int not null,
  	foreign key (category_id) references categories(id)
);

alter table articles add column date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;