PGDMP     *                
    v            matcha    10.5    10.5     V           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            W           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            X           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false            Y           1262    16384    matcha    DATABASE     x   CREATE DATABASE matcha WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';
    DROP DATABASE matcha;
             grevenko    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
             grevenko    false            Z           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                  grevenko    false    3                        3079    13267    plpgsql 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
    DROP EXTENSION plpgsql;
                  false            [           0    0    EXTENSION plpgsql    COMMENT     @   COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';
                       false    1            �            1259    16411 	   interests    TABLE     W   CREATE TABLE public.interests (
    interest text NOT NULL,
    id integer NOT NULL
);
    DROP TABLE public.interests;
       public         grevenko    false    3            �            1259    16417    interests_id_seq    SEQUENCE     �   CREATE SEQUENCE public.interests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.interests_id_seq;
       public       grevenko    false    3    197            \           0    0    interests_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.interests_id_seq OWNED BY public.interests.id;
            public       grevenko    false    198            �            1259    16385    users    TABLE     F  CREATE TABLE public.users (
    login text NOT NULL,
    password text NOT NULL,
    email text NOT NULL,
    hash text NOT NULL,
    active boolean DEFAULT false NOT NULL,
    gender character varying(6) DEFAULT 'male'::text NOT NULL,
    preferences character varying(12) DEFAULT 'heterosexual'::text NOT NULL,
    bio text DEFAULT ''::text,
    interests text[] DEFAULT ARRAY[]::text[],
    gallery text[] DEFAULT ARRAY[''::text, ''::text, ''::text, ''::text, ''::text] NOT NULL,
    id integer NOT NULL,
    avatarid integer DEFAULT 0 NOT NULL,
    CONSTRAINT check_gender CHECK ((((gender)::text = 'male'::text) OR ((gender)::text = 'female'::text))),
    CONSTRAINT check_preferences CHECK ((((preferences)::text = 'heterosexual'::text) OR ((preferences)::text = 'homosexual'::text) OR ((preferences)::text = 'bisexual'::text)))
);
    DROP TABLE public.users;
       public         grevenko    false    3            �            1259    16426    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public       grevenko    false    196    3            ]           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
            public       grevenko    false    199            �           2604    16419    interests id    DEFAULT     l   ALTER TABLE ONLY public.interests ALTER COLUMN id SET DEFAULT nextval('public.interests_id_seq'::regclass);
 ;   ALTER TABLE public.interests ALTER COLUMN id DROP DEFAULT;
       public       grevenko    false    198    197            �           2604    16428    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public       grevenko    false    199    196            Q          0    16411 	   interests 
   TABLE DATA               1   COPY public.interests (interest, id) FROM stdin;
    public       grevenko    false    197   �       P          0    16385    users 
   TABLE DATA               �   COPY public.users (login, password, email, hash, active, gender, preferences, bio, interests, gallery, id, avatarid) FROM stdin;
    public       grevenko    false    196   �       ^           0    0    interests_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.interests_id_seq', 5, true);
            public       grevenko    false    198            _           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 4, true);
            public       grevenko    false    199            Q   8   x�+JML��K�4�*.�/*)�4��OO�4��--�L�4���/�L-�4����� x��      P     x�m��j1��ާ(9/�lK���Az�m9Y؍�lRB޽��CR
��̤v�,J��]}�&�mn��W�ģ������>������M�47�
:>�A����?Fi��������ː�<v�ԾY�e��y���y�Nmy7h=FM���d4������gɕ��Ϋ�/�Q;JHF��Tj�9G01Xr�aH��1�f�B� �Tq5@M1�s���)D|fX�/�5�'o z�VZSM�P�aS<�KN���f�9U��j+U�cZ9Keu��`n�*�>�]�� x��C     