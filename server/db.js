const pgp = require("pg-promise")(/*options*/);
const db = pgp("postgres://grevenko:postgres@localhost:5432/matcha");

db.any(`
CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;

    COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';

    SET default_tablespace = '';

    SET default_with_oids = false;

    CREATE TABLE IF NOT EXISTS public.blocks (
        id integer NOT NULL,
        blocker text NOT NULL,
        blockee text NOT NULL
    );

    ALTER TABLE public.blocks OWNER TO grevenko;

    CREATE SEQUENCE IF NOT EXISTS public.blocks_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER TABLE public.blocks_id_seq OWNER TO grevenko;

    ALTER SEQUENCE public.blocks_id_seq OWNED BY public.blocks.id;

    CREATE TABLE IF NOT EXISTS public.interests (
        interest text NOT NULL,
        id integer NOT NULL
    );

    ALTER TABLE public.interests OWNER TO grevenko;

    CREATE SEQUENCE IF NOT EXISTS public.interests_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER TABLE public.interests_id_seq OWNER TO grevenko;

    ALTER SEQUENCE public.interests_id_seq OWNED BY public.interests.id;

    CREATE TABLE IF NOT EXISTS public.likes (
        id integer NOT NULL,
        liker text NOT NULL,
        likee text NOT NULL
    );

    ALTER TABLE public.likes OWNER TO grevenko;

    CREATE SEQUENCE IF NOT EXISTS public.likes_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER TABLE public.likes_id_seq OWNER TO grevenko;

    ALTER SEQUENCE public.likes_id_seq OWNED BY public.likes.id;

    CREATE TABLE IF NOT EXISTS public.messages (
        sender text NOT NULL,
        receiver text NOT NULL,
        message text NOT NULL,
        "time" bigint NOT NULL,
        id integer NOT NULL
    );

    ALTER TABLE public.messages OWNER TO grevenko;

    CREATE SEQUENCE IF NOT EXISTS public.messages_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER TABLE public.messages_id_seq OWNER TO grevenko;

    ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;

    CREATE TABLE IF NOT EXISTS public.users (
        login text NOT NULL,
        password text NOT NULL,
        email text NOT NULL,
        hash character(16) DEFAULT ''::text NOT NULL,
        active boolean DEFAULT false NOT NULL,
        gender character varying(6) DEFAULT 'male'::text NOT NULL,
        preferences character varying(12) DEFAULT 'heterosexual'::text NOT NULL,
        bio text DEFAULT ''::text NOT NULL,
        interests text[] DEFAULT ARRAY[]::text[] NOT NULL,
        gallery text[] DEFAULT ARRAY[]::text[] NOT NULL,
        id integer NOT NULL,
        avatarid integer DEFAULT 0 NOT NULL,
        firstname text DEFAULT 'John'::text NOT NULL,
        lastname text DEFAULT 'Doe'::text NOT NULL,
        fame integer DEFAULT 0 NOT NULL,
        location numeric[] DEFAULT ARRAY[0, 0] NOT NULL,
        age integer DEFAULT 18 NOT NULL,
        visited text[] DEFAULT ARRAY[]::text[] NOT NULL,
        fake boolean DEFAULT false NOT NULL,
        "time" bigint DEFAULT 0 NOT NULL,
        online boolean DEFAULT false NOT NULL,
        CONSTRAINT check_gender CHECK ((((gender)::text = 'male'::text) OR ((gender)::text = 'female'::text))),
        CONSTRAINT check_preferences CHECK ((((preferences)::text = 'heterosexual'::text) OR ((preferences)::text = 'homosexual'::text) OR ((preferences)::text = 'bisexual'::text)))
    );

    ALTER TABLE public.users OWNER TO grevenko;

    CREATE SEQUENCE IF NOT EXISTS public.users_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    ALTER TABLE public.users_id_seq OWNER TO grevenko;

    ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

    ALTER TABLE ONLY public.blocks ALTER COLUMN id SET DEFAULT nextval('public.blocks_id_seq'::regclass);

    ALTER TABLE ONLY public.interests ALTER COLUMN id SET DEFAULT nextval('public.interests_id_seq'::regclass);

    ALTER TABLE ONLY public.likes ALTER COLUMN id SET DEFAULT nextval('public.likes_id_seq'::regclass);

    ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);

    ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

    DELETE FROM public.blocks;

    DELETE FROM public.interests;

    DELETE FROM public.likes;

    DELETE FROM public.messages;
    
    DELETE FROM public.users;

    INSERT INTO public.users
      (
        login,
        password,
        email,
        active,
        gender,
        preferences,
        firstname,
        lastname
      )
      VALUES
      (
        'ivan77',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'ivan@gmail.com',
        true,
        'male',
        'heterosexual',
        'Ivan',
        'I'
      ),
      (
        'misha7',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'misha@gmail.com',
        true,
        'male',
        'heterosexual',
        'Misha',
        'M'
      ),
      (
        'ura777',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'ura@gmail.com',
        true,
        'male',
        'heterosexual',
        'Ura',
        'U'
      ),
      (
        'olya77',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'olya@gmail.com',
        true,
        'female',
        'heterosexual',
        'Olya',
        'O'
      ),
      (
        'sasha7',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'sasha@gmail.com',
        true,
        'male',
        'heterosexual',
        'Sasha',
        'S'
      ),
      (
        'borys7',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'borys@gmail.com',
        true,
        'male',
        'heterosexual',
        'Borys',
        'B'
      ),
      (
        'nastya',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'nastya@gmail.com',
        true,
        'female',
        'heterosexual',
        'Nastya',
        'N'
      ),
      (
        'anna77',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'annar703unit@gmail.com',
        true,
        'female',
        'heterosexual',
        'Anna',
        'A'
      );

    SELECT pg_catalog.setval('public.blocks_id_seq', 1, true);

    SELECT pg_catalog.setval('public.interests_id_seq', 1, true);
    
    SELECT pg_catalog.setval('public.likes_id_seq', 1, true);
    
    SELECT pg_catalog.setval('public.messages_id_seq', 1, true);
    
    SELECT pg_catalog.setval('public.users_id_seq', 1, true);
`);
