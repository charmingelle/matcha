const config = require('./server/config/config');
const db = require('pg-promise')()(config.db.url);

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
        preferences character varying(12) DEFAULT 'bisexual'::text NOT NULL,
        bio text DEFAULT ''::text NOT NULL,
        interests text[] DEFAULT ARRAY[]::text[] NOT NULL,
        gallery text[] DEFAULT ARRAY['avatar.png']::text[] NOT NULL,
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

    INSERT INTO public.interests
      (interest)
      VALUES
      ('yoga'),
      ('dancing'),
      ('reading'),
      ('computers'),
      ('space'),
      ('cars'),
      ('motorcycles'),
      ('diving'),
      ('travelling'),
      ('running'),
      ('gardening'),
      ('programming'),
      ('sewing'),
      ('athletics'),
      ('fishing'),
      ('hiking'),
      ('jogging'),
      ('boxing'),
      ('singing'),
      ('swimming'),
      ('skiing'),
      ('skateboard'),
      ('photography'),
      ('ballet');

    INSERT INTO public.users
      (
        login,
        password,
        email,
        active,
        gender,
        preferences,
        firstname,
        lastname,
        location,
        gallery,
        age,
        interests,
        bio
      )
      VALUES
      (
        'dima77',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'dima@gmail.com',
        true,
        'male',
        'heterosexual',
        'Dima',
        'Dawson',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['dima.png'],
        34,
        ARRAY['cars', 'motorcycles', 'diving', 'travelling', 'running', 'boxing'],
        'Being active and enthusiastic, I am looking for a company for having fun. Join me and you will not regret!'
      ),
      (
        'misha7',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'misha@gmail.com',
        true,
        'male',
        'heterosexual',
        'Misha',
        'Melvin',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['misha.png'],
        25,
        ARRAY['dancing', 'reading', 'computers', 'travelling', 'swimming'],
        'Hi! Let us get to know each other :)'
      ),
      (
        'ura777',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'ura@gmail.com',
        true,
        'male',
        'heterosexual',
        'Ura',
        'Udin',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['ura.png'],
        20,
        ARRAY['reading', 'computers', 'space', 'motorcycles', 'programming', 'skateboard'],
        ''
      ),
      (
        'olya77',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'olya@gmail.com',
        true,
        'female',
        'heterosexual',
        'Olya',
        'Olmo',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['olya.png'],
        19,
        ARRAY['yoga', 'dancing', 'gardening', 'sewing', 'singing', 'photography'],
        'People are different. That is the beauty of love. I dream about meeting someone completely different but so interesting!'
      ),
      (
        'sasha7',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'sasha@gmail.com',
        true,
        'male',
        'heterosexual',
        'Sasha',
        'Swinton',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['sasha.png'],
        40,
        ARRAY['reading', 'travelling', 'athletics', 'fishing', 'hiking', 'jogging'],
        ''
      ),
      (
        'borys7',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'borys@gmail.com',
        true,
        'male',
        'heterosexual',
        'Borys',
        'Brave',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['borys.png'],
        39,
        ARRAY['yoga', 'dancing', 'travelling', 'gardening', 'singing', 'swimming', 'photography'],
        'Let us talk, walk, ride a bike, travel. Life is too short to sit at home!'
      ),
      (
        'nastya',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'nastya@gmail.com',
        true,
        'female',
        'heterosexual',
        'Nastya',
        'Nilson',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['nastya.png'],
        23,
        ARRAY['yoga', 'dancing', 'reading', 'skiing', 'ballet'],
        'I love spending time at home except for snowy winter days, so romantic... Dancing is my passion!'
      ),
      (
        'anna77',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'anna@gmail.com',
        true,
        'female',
        'heterosexual',
        'Anna',
        'Adams',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['anna.png'],
        30,
        ARRAY['yoga', 'reading', 'computers', 'travelling', 'programming', 'photography'],
        'Hey you, it is nice that you are checking my profile. Do not forget to chat with me, would be glad ;)'
      ),
      (
        'femabi',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'femabi@gmail.com',
        true,
        'female',
        'bisexual',
        'Fiona',
        'Fay',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['femabi.png'],
        35,
        ARRAY['reading', 'cars', 'travelling', 'running', 'jogging', 'skateboard'],
        'It feels like you already know me for ages. Am I right?'
      ),
      (
        'femabi2',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'femabi2@gmail.com',
        true,
        'female',
        'bisexual',
        'Louise',
        'Ford',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['femabi2.png'],
        42,
        ARRAY['reading', 'gardening', 'sewing', 'fishing', 'photography'],
        'Kindness and inner light melts the ice. Welcome to my space, sweetheart!'
      ),
      (
        'malebi',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'malebi@gmail.com',
        true,
        'male',
        'bisexual',
        'Jeremy',
        'Hunt',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['malebi.png'],
        20,
        ARRAY['dancing', 'singing', 'ballet'],
        'You are young and you do not afraid of experiments? I think we have much in common.'
      ),
      (
        'malebi2',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'malebi2@gmail.com',
        true,
        'male',
        'bisexual',
        'Alan',
        'Watts',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['malebi2.png'],
        44,
        ARRAY['reading', 'computers', 'travelling', 'photography'],
        ''
      ),
      (
        'gayguy',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'gayguy@gmail.com',
        true,
        'male',
        'homosexual',
        'Tom',
        'Brady',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['gayguy.png'],
        26,
        ARRAY['dancing', 'athletics', 'singing', 'photography'],
        ''
      ),
      (
        'gayguy2',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'gayguy2@gmail.com',
        true,
        'male',
        'homosexual',
        'Samuel',
        'Silverman',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['gayguy2.png'],
        33,
        ARRAY['computers', 'cars', 'swimming', 'skiing'],
        'Hi, join me on my life journey :)'
      ),
      (
        'lesbian',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'lesbian@gmail.com',
        true,
        'female',
        'homosexual',
        'Kate',
        'Spade',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['lesbian.png'],
        21,
        ARRAY['dancing', 'athletics', 'photography'],
        ''
      ),
      (
        'lesbian2',
        '$2b$10$OaheWFrExG13Nv8DFFxwLuY8uOkBOG0pSirbQpL6hcDpaa5bpoa5G',
        'lesbian2@gmail.com',
        true,
        'female',
        'homosexual',
        'Lucie',
        'Arnaz',
        ARRAY[50.468431599999995,30.4518626],
        ARRAY['lesbian2.png'],
        24,
        ARRAY['computers', 'space', 'motorcycles', 'hiking', 'jogging'],
        'Love dogs and playing computer games all night. If you are not too serious, we can have fun together!'
      );
`);
