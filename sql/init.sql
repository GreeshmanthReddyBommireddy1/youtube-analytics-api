
CREATE TABLE users (
    user_id         SERIAL          PRIMARY KEY,
    username        VARCHAR(50)     NOT NULL UNIQUE,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    full_name       VARCHAR(100)    NOT NULL,
    country_code    CHAR(2)         NOT NULL,
    joined_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_users_username_length
        CHECK (char_length(username) >= 3),
    CONSTRAINT chk_users_email_format
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);



CREATE TABLE app_users (

    id SERIAL PRIMARY KEY,

    username VARCHAR(100) UNIQUE NOT NULL,

    password TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (role_name)
VALUES
('admin'),
('creator'),
('viewer');


CREATE TABLE user_roles (
    user_role_id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    role_id INTEGER NOT NULL,

    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id)
        REFERENCES app_users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
        ON DELETE CASCADE
);

CREATE TABLE channels (
    channel_id      SERIAL          PRIMARY KEY,
    user_id         INTEGER         NOT NULL,
    channel_name    VARCHAR(100)    NOT NULL UNIQUE,
    description     TEXT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_verified     BOOLEAN         NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_channels_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_channels_name_length
        CHECK (char_length(channel_name) >= 2)
);


CREATE TABLE genres (
    genre_id        SERIAL          PRIMARY KEY,
    genre_name      VARCHAR(50)     NOT NULL UNIQUE,
    description     VARCHAR(255),
    CONSTRAINT chk_genres_name_not_empty
        CHECK (char_length(trim(genre_name)) > 0)
);


CREATE TABLE videos (
    video_id            SERIAL          PRIMARY KEY,
    channel_id          INTEGER         NOT NULL,
    genre_id            INTEGER         NOT NULL,
    title               VARCHAR(200)    NOT NULL,
    description         TEXT,
    upload_date         DATE            NOT NULL DEFAULT CURRENT_DATE,
    duration_seconds    INTEGER         NOT NULL DEFAULT 0,
    view_count          BIGINT          NOT NULL DEFAULT 0,
    like_count          INTEGER         NOT NULL DEFAULT 0,
    dislike_count       INTEGER         NOT NULL DEFAULT 0,
    is_public           BOOLEAN         NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_videos_channel
        FOREIGN KEY (channel_id) REFERENCES channels(channel_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_videos_genre
        FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_videos_duration_positive
        CHECK (duration_seconds >= 0),
    CONSTRAINT chk_videos_view_count_non_negative
        CHECK (view_count >= 0),
    CONSTRAINT chk_videos_like_count_non_negative
        CHECK (like_count >= 0),
    CONSTRAINT chk_videos_dislike_count_non_negative
        CHECK (dislike_count >= 0),
    CONSTRAINT chk_videos_title_not_empty
        CHECK (char_length(trim(title)) > 0)
);



CREATE TABLE subscriptions (
    subscription_id SERIAL          PRIMARY KEY,
    user_id         INTEGER         NOT NULL,
    channel_id      INTEGER         NOT NULL,
    subscribed_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notification_on BOOLEAN         NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_subscriptions_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_subscriptions_channel
        FOREIGN KEY (channel_id) REFERENCES channels(channel_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_subscriptions_user_channel
        UNIQUE (user_id, channel_id)
);


CREATE TABLE comments (
    comment_id      SERIAL          PRIMARY KEY,
    video_id        INTEGER         NOT NULL,
    user_id         INTEGER         NOT NULL,
    comment_text    TEXT            NOT NULL,
    commented_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    like_count      INTEGER         NOT NULL DEFAULT 0,
    CONSTRAINT fk_comments_video
        FOREIGN KEY (video_id) REFERENCES videos(video_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_comments_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_comments_text_not_empty
        CHECK (char_length(trim(comment_text)) > 0),
    CONSTRAINT chk_comments_like_count_non_negative
        CHECK (like_count >= 0)
);


INSERT INTO users (username, email, full_name, country_code, joined_at, is_active) VALUES
('alex_creator',    'alex.chen@email.com',      'Alex Chen',           'US', '2022-01-15 10:00:00', TRUE),
('bella_streams',   'bella.rossi@email.com',    'Bella Rossi',         'IT', '2022-03-22 14:30:00', TRUE),
('carlos_tech',     'carlos.m@email.com',       'Carlos Mendez',       'MX', '2021-11-08 09:15:00', TRUE),
('dana_music',      'dana.kim@email.com',       'Dana Kim',            'KR', '2023-02-10 16:45:00', TRUE),
('evan_gamer',      'evan.w@email.com',         'Evan Walsh',          'GB', '2022-07-04 11:20:00', TRUE),
('fiona_fitness',   'fiona.l@email.com',        'Fiona Lee',           'AU', '2023-05-18 08:00:00', TRUE),
('george_cooks',    'george.p@email.com',       'George Patel',        'IN', '2021-09-30 13:10:00', TRUE),
('hannah_art',      'hannah.b@email.com',       'Hannah Brooks',       'CA', '2022-12-01 17:55:00', TRUE),
('ivan_science',    'ivan.petrov@email.com',    'Ivan Petrov',         'RU', '2022-04-14 12:40:00', TRUE),
('julia_travel',    'julia.s@email.com',        'Julia Santos',        'BR', '2023-01-25 15:25:00', TRUE),
('kevin_code',      'kevin.nguyen@email.com',   'Kevin Nguyen',        'US', '2021-06-12 10:05:00', TRUE),
('luna_vlogs',      'luna.m@email.com',         'Luna Martinez',       'ES', '2023-08-03 19:30:00', TRUE),
('marcus_history',  'marcus.j@email.com',       'Marcus Johnson',      'US', '2020-12-20 07:50:00', TRUE),
('nina_beauty',     'nina.a@email.com',         'Nina Andersson',      'SE', '2023-03-11 14:00:00', TRUE),
('omar_film',       'omar.h@email.com',         'Omar Hassan',         'EG', '2022-09-19 18:15:00', TRUE);


-- -----------------------------------------------------------------------------
-- CHANNELS (8) - owned by users 1-8
-- -----------------------------------------------------------------------------
INSERT INTO channels (user_id, channel_name, description, created_at, is_verified) VALUES
(1,  'TechVault',           'Deep dives into gadgets, AI, and software.',           '2022-02-01', TRUE),
(2,  'BellaLive',           'Live streams, lifestyle, and community Q&A.',          '2022-04-01', TRUE),
(3,  'CodeWithCarlos',      'Programming tutorials from beginner to advanced.',     '2021-12-01', TRUE),
(4,  'DanaBeats',           'Original music, covers, and production tips.',         '2023-03-01', FALSE),
(5,  'EvanPlays',           'Gaming walkthroughs, reviews, and esports.',           '2022-08-01', TRUE),
(6,  'FitWithFiona',        'Workouts, nutrition, and wellness journeys.',          '2023-06-01', FALSE),
(7,  'GeorgeKitchen',       'Quick recipes and global street food.',                '2021-10-15', TRUE),
(8,  'HannahStudio',        'Digital art tutorials and speed paints.',              '2023-01-01', FALSE);

-- -----------------------------------------------------------------------------
-- GENRES (8)
-- -----------------------------------------------------------------------------
INSERT INTO genres (genre_name, description) VALUES
('Technology',   'Tech reviews, coding, and innovation'),
('Gaming',       'Video games, streams, and esports'),
('Music',        'Songs, covers, and music production'),
('Education',    'Tutorials, lectures, and how-to content'),
('Lifestyle',    'Vlogs, fashion, and daily life'),
('Fitness',      'Exercise, health, and sports'),
('Food',         'Cooking, recipes, and food culture'),
('Art',          'Drawing, design, and creative process');

-- -----------------------------------------------------------------------------
-- VIDEOS (20)
-- -----------------------------------------------------------------------------
INSERT INTO videos (channel_id, genre_id, title, description, upload_date, duration_seconds, view_count, like_count, dislike_count, is_public) VALUES
(1, 1, 'iPhone 16 Pro: 30-Day Review',              'Real-world battery, camera, and AI features tested.',     '2024-09-01', 1240,  2850000, 142000, 3200,  TRUE),
(1, 1, 'Build a REST API with Node.js',             'Step-by-step backend tutorial for beginners.',            '2024-07-15', 3420,  890000,  67000,  890,  TRUE),
(1, 4, 'SQL for Data Analysts in 60 Minutes',       'JOINs, aggregates, and window functions explained.',      '2024-05-20', 3600,  1200000, 98000,  450,  TRUE),
(2, 5, 'Morning Routine 2024',                      'Productivity habits that actually stick.',                '2024-08-10',  720,   450000,  38000,  210,  TRUE),
(2, 5, 'Room Makeover on a Budget',                 'DIY decor under $200.',                                   '2024-06-02', 1080,   620000,  52000,  340,  TRUE),
(3, 4, 'Python OOP Explained Simply',               'Classes, inheritance, and polymorphism.',                 '2024-04-18', 2100,  2100000, 156000, 1200, TRUE),
(3, 1, 'Docker for Developers',                     'Containers, images, and compose files.',                  '2024-03-05', 2700,  1750000, 124000,  980, TRUE),
(3, 4, 'LeetCode Patterns You Must Know',           'Ace technical interviews with these strategies.',         '2024-10-01', 3900,   980000,  89000,  670,  TRUE),
(4, 3, 'Midnight Rain - Original Song',             'Official music video.',                                   '2024-07-22',  245,  3200000, 210000, 1500, TRUE),
(4, 3, 'Home Studio on $500',                       'Budget gear that sounds professional.',                   '2024-02-14', 1560,   540000,  41000,  220,  TRUE),
(5, 2, 'Elden Ring DLC Full Walkthrough Part 1',    'No commentary boss guide.',                               '2024-08-28', 5400,  4100000, 298000, 4200, TRUE),
(5, 2, 'Best Indie Games of 2024',                  'Hidden gems you should play.',                            '2024-09-15', 1320,  1650000, 112000,  890, TRUE),
(5, 2, 'Setup Tour: Pro Gamer Desk 2024',           'Monitors, peripherals, and cable management.',            '2024-01-10',  900,   890000,  76000,  410, TRUE),
(6, 6, '30-Minute HIIT for Beginners',              'No equipment fat-burn workout.',                          '2024-09-05', 1800,   720000,  58000,  180, TRUE),
(6, 6, 'What I Eat in a Day - Cut Phase',           'Meal prep and macros breakdown.',                         '2024-07-01',  840,   380000,  29000,  95,   TRUE),
(7, 7, 'Authentic Butter Chicken in 20 Min',        'Restaurant-style recipe at home.',                        '2024-08-20', 1200,  2500000, 198000, 2100, TRUE),
(7, 7, 'Street Tacos: Mexico City Edition',         'Food tour and recipe recreation.',                        '2024-05-12', 1680,  1890000, 145000,  780, TRUE),
(8, 8, 'Procreate Portrait from Photo',             'Layering and brush techniques.',                          '2024-06-18', 2400,   650000,  48000,  120, TRUE),
(8, 8, 'Color Theory for Digital Artists',          'Harmony, contrast, and mood.',                            '2024-04-02', 1980,   420000,  36000,   85, TRUE),
(1, 1, 'AI Tools That Replace Busywork in 2025',    'ChatGPT, Copilot, and workflow automation.',              '2024-11-01', 1500,   156000,  12000,   45, TRUE);

-- -----------------------------------------------------------------------------
-- SUBSCRIPTIONS (realistic fan base across channels)
-- -----------------------------------------------------------------------------
INSERT INTO subscriptions (user_id, channel_id, subscribed_at, notification_on) VALUES
-- TechVault (channel 1) - popular tech channel
(2, 1, '2022-05-01', TRUE), (3, 1, '2022-06-10', TRUE), (5, 1, '2022-08-15', TRUE),
(9, 1, '2023-01-20', FALSE), (11, 1, '2023-04-05', TRUE), (12, 1, '2023-07-12', TRUE),
(13, 1, '2022-11-30', TRUE), (14, 1, '2024-01-08', TRUE), (15, 1, '2024-02-14', TRUE),
-- BellaLive
(1, 2, '2022-06-01', TRUE), (4, 2, '2023-04-10', TRUE), (6, 2, '2023-08-01', TRUE),
(7, 2, '2023-09-15', FALSE), (10, 2, '2024-01-22', TRUE),
-- CodeWithCarlos - high subscriber count
(1, 3, '2022-01-10', TRUE), (2, 3, '2022-03-01', TRUE), (4, 3, '2023-01-05', TRUE),
(5, 3, '2022-09-20', TRUE), (6, 3, '2023-02-18', TRUE), (8, 3, '2023-05-25', TRUE),
(9, 3, '2022-12-01', TRUE), (10, 3, '2023-06-30', TRUE), (11, 3, '2023-08-11', TRUE),
(12, 3, '2024-03-01', TRUE), (13, 3, '2022-07-07', TRUE), (14, 3, '2024-04-12', TRUE),
(15, 3, '2024-05-20', TRUE),
-- DanaBeats
(1, 4, '2023-04-01', TRUE), (5, 4, '2023-10-10', TRUE), (7, 4, '2024-02-01', TRUE),
-- EvanPlays - largest gaming audience
(1, 5, '2022-09-01', TRUE), (2, 5, '2022-10-15', TRUE), (3, 5, '2023-01-01', TRUE),
(4, 5, '2023-03-20', TRUE), (6, 5, '2023-11-05', TRUE), (8, 5, '2024-01-15', TRUE),
(9, 5, '2023-05-10', TRUE), (10, 5, '2023-12-20', TRUE), (11, 5, '2024-02-28', TRUE),
(12, 5, '2024-06-01', TRUE), (13, 5, '2023-07-19', TRUE), (14, 5, '2024-03-03', TRUE),
(15, 5, '2024-07-07', TRUE),
-- FitWithFiona
(2, 6, '2023-07-01', TRUE), (4, 6, '2023-09-10', FALSE), (9, 6, '2024-01-05', TRUE),
-- GeorgeKitchen - food hits big numbers
(1, 7, '2021-12-01', TRUE), (3, 7, '2022-02-14', TRUE), (5, 7, '2022-06-18', TRUE),
(6, 7, '2023-01-25', TRUE), (8, 7, '2023-04-30', TRUE), (10, 7, '2023-08-08', TRUE),
(11, 7, '2023-10-22', TRUE), (12, 7, '2024-01-11', TRUE), (13, 7, '2022-05-05', TRUE),
(14, 7, '2024-02-20', TRUE), (15, 7, '2024-04-01', TRUE),
-- HannahStudio
(2, 8, '2023-02-15', TRUE), (6, 8, '2023-09-01', TRUE), (7, 8, '2024-03-10', TRUE);

-- -----------------------------------------------------------------------------
-- COMMENTS (35+ comments for engagement analysis)
-- -----------------------------------------------------------------------------
INSERT INTO comments (video_id, user_id, comment_text, commented_at, like_count) VALUES
(1,  3,  'Best phone review this year. Battery section was spot on!',           '2024-09-02 08:12:00', 245),
(1,  5,  'Still sticking with my 14 Pro after this.',                          '2024-09-02 14:30:00', 89),
(1,  11, 'The AI features demo blew my mind.',                                   '2024-09-03 10:05:00', 156),
(6,  1,  'Finally understood polymorphism. Subscribed!',                         '2024-04-19 09:00:00', 512),
(6,  2,  'Can you do a follow-up on design patterns?',                           '2024-04-19 11:22:00', 198),
(6,  9,  'Clearest OOP explanation on YouTube.',                                 '2024-04-20 16:45:00', 340),
(7,  4,  'Docker clicked for me after this video.',                              '2024-03-06 07:30:00', 278),
(7,  10, 'Please cover Kubernetes next!',                                        '2024-03-07 12:00:00', 145),
(9,  1,  'This song is on repeat. Beautiful vocals.',                            '2024-07-23 20:15:00', 890),
(9,  5,  'Production quality is insane for indie.',                              '2024-07-23 22:40:00', 423),
(9,  7,  'Chills at the chorus. Dana is underrated.',                            '2024-07-24 06:10:00', 267),
(11, 2,  'Boss guide saved me hours. Thank you Evan!',                           '2024-08-29 01:30:00', 1205),
(11, 3,  'Part 2 when??',                                                        '2024-08-29 08:00:00', 678),
(11, 6,  'No commentary is the way to go for DLC.',                              '2024-08-29 15:20:00', 334),
(11, 12, 'Subscribed for Elden content.',                                        '2024-08-30 09:45:00', 156),
(16, 1,  'Made this tonight. Family loved it!',                                  '2024-08-21 18:00:00', 567),
(16, 3,  'Best butter chicken recipe on the platform.',                          '2024-08-21 19:30:00', 892),
(16, 8,  'The spice balance is perfect. George delivers again.',                 '2024-08-22 11:00:00', 445),
(16, 13, 'Restaurant quality at home. Wow.',                                     '2024-08-22 14:15:00', 321),
(3,  11, 'This SQL tutorial got me my first analyst job.',                       '2024-05-21 10:00:00', 678),
(3,  13, 'Window functions section needs a part 2.',                             '2024-05-22 08:30:00', 112),
(8,  5,  'Passed 3 interviews using these patterns.',                            '2024-10-02 09:15:00', 445),
(8,  9,  'Dynamic programming chapter was gold.',                              '2024-10-02 14:00:00', 289),
(12, 4,  'Played 4 games from this list. All bangers.',                          '2024-09-16 20:00:00', 198),
(12, 7,  'Hollow Knight mention made my day.',                                   '2024-09-16 21:30:00', 87),
(14, 2,  'Finished this workout drenched. Effective!',                           '2024-09-06 07:00:00', 134),
(14, 10, 'Perfect for hotel rooms when traveling.',                              '2024-09-06 12:45:00', 76),
(18, 6,  'Your brush settings tutorial helped so much.',                         '2024-06-19 16:00:00', 98),
(18, 14, 'Portrait turned out amazing following this.',                          '2024-06-19 18:30:00', 67),
(17, 1,  'Mexico City trip planned because of this video.',                      '2024-05-13 11:00:00', 234),
(17, 15, 'Taco recipe is authentic. Omar approved.',                             '2024-05-13 15:20:00', 189),
(2,  12, 'Great pacing for beginners. Built my first API.',                      '2024-07-16 13:00:00', 156),
(2,  14, 'Error handling section could be longer.',                              '2024-07-16 17:00:00', 45),
(20, 3,  'Copilot tips alone worth the watch.',                                  '2024-11-02 08:00:00', 89),
(20, 13, 'Short but packed with value.',                                         '2024-11-02 10:30:00', 34),
(5,  4,  'DIY queen! My room looks so much better.',                           '2024-06-03 19:00:00', 223),
(4,  8,  'Trying this routine tomorrow morning.',                                '2024-08-11 06:00:00', 112),
(10, 6, 'Investing in the mic you recommended.',                                '2024-02-15 14:00:00', 78),
(13, 9, 'Desk goals. What chair is that?',                                       '2024-01-11 20:00:00', 167);



