create extension if not exists "uuid-ossp";

create type consultation_mode as enum ('cabinet', 'online', 'both');

create table cities (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  region      text,
  country     text not null default 'FR',
  created_at  timestamptz not null default now()
);

create table specialties (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text,
  created_at  timestamptz not null default now()
);

create table practitioners (
  id                  uuid primary key default uuid_generate_v4(),
  slug                text not null unique,
  first_name          text not null,
  last_name           text not null,
  city_id             uuid not null references cities(id),
  specialty_id        uuid not null references specialties(id),
  bio                 text,
  photo_url           text,
  certification       text,
  school              text,
  years_active        int,
  hourly_rate         int,
  consultation_mode   consultation_mode not null default 'cabinet',
  neighborhood        text,
  website_url         text,
  doctolib_url        text,
  booking_url         text,
  instagram_url       text,
  facebook_url        text,
  is_premium          boolean not null default false,
  is_verified         boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table practitioner_tags (
  id                uuid primary key default uuid_generate_v4(),
  practitioner_id   uuid not null references practitioners(id) on delete cascade,
  label             text not null
);

create table testimonials (
  id                uuid primary key default uuid_generate_v4(),
  practitioner_id   uuid not null references practitioners(id) on delete cascade,
  author_name       text not null,
  author_location   text,
  content           text not null,
  date              date
);

create table blog_posts (
  id                uuid primary key default uuid_generate_v4(),
  slug              text not null unique,
  title             text not null,
  excerpt           text,
  content           text,
  city_id           uuid references cities(id),
  specialty_id      uuid references specialties(id),
  reading_time_min  int,
  published_at      timestamptz,
  updated_at        timestamptz not null default now()
);

alter table cities             enable row level security;
alter table specialties        enable row level security;
alter table practitioners      enable row level security;
alter table practitioner_tags  enable row level security;
alter table testimonials       enable row level security;
alter table blog_posts         enable row level security;

create policy "public_read" on cities            for select using (true);
create policy "public_read" on specialties       for select using (true);
create policy "public_read" on practitioners     for select using (true);
create policy "public_read" on practitioner_tags for select using (true);
create policy "public_read" on testimonials      for select using (true);
create policy "public_read" on blog_posts        for select using (published_at <= now());
