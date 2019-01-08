const format = require('pg-format');

module.exports = {
  getSuggestionsFromDB(login, db) {
    return db
      .any('SELECT gender, preferences FROM users WHERE login = ${login}', {
        login
      })
      .then(data => {
        let request,
          params = {
            login
          };

        if (
          (data[0].gender === 'male' &&
            data[0].preferences === 'heterosexual') ||
          (data[0].gender === 'female' && data[0].preferences === 'homosexual')
        ) {
          request =
            'SELECT * FROM users WHERE login <> ${login} AND gender = ${gender}';
          params.gender = 'female';
        } else if (
          (data[0].gender === 'female' &&
            data[0].preferences === 'heterosexual') ||
          (data[0].gender === 'male' && data[0].preferences === 'homosexual')
        ) {
          request =
            'SELECT * FROM users WHERE login <> ${login} AND gender = ${gender}';
          params.gender = 'male';
        } else {
          request = 'SELECT * FROM users WHERE login <> ${login}';
        }
        return db.any(request, params);
      });
  },

  getChatDataFromDB(login, db) {
    return db
      .any('SELECT likee FROM likes WHERE liker = ${login}', {
        login
      })
      .then(data => {
        if (data.length > 0) {
          data = data.map(record => record.likee);

          const query = format(
            'SELECT liker FROM likes WHERE liker IN (%L) AND likee = %L',
            data,
            login
          );

          return db.any(query).then(data => {
            if (data.length > 0) {
              data = data.map(record => record.liker);

              const query = format(
                'SELECT login, online, gallery, avatarid FROM users WHERE login IN (%L)',
                data
              );
              return db.any(query).then(data => {
                let chatData = {};

                data.forEach(
                  record =>
                    (chatData[record.login] = {
                      online: record.online,
                      gallery: record.gallery,
                      avatarid: record.avatarid,
                      log: []
                    })
                );
                data = data.map(record => record.login);

                const query = format(
                  "SELECT * FROM messages WHERE (sender IN (%L) AND receiver = '%s') OR (sender = '%s' AND receiver IN (%L)) ORDER BY id DESC",
                  data,
                  login,
                  login,
                  data
                );

                return db.any(query).then(data => {
                  data.forEach(record => {
                    if (record.sender === login) {
                      chatData[record.receiver].log.push(record);
                    } else {
                      chatData[record.sender].log.push(record);
                    }
                  });
                  return chatData;
                });
              });
            }
            return [];
          });
        }
        return [];
      });
  }
};
