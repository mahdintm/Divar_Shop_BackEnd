import "dotenv/config";
import ActiveDirectory from "activedirectory";

const config = {
  url: process.env.LDAP_URL,
  baseDN: process.env.LDAP_BASE_DN,
  bindDN: process.env.LDAP_BIND_DN,
  bindCredentials: process.env.LDAP_BIND_CREDENTIALS,
};

const ad = new ActiveDirectory(config);

export class LDAP {
  static authenticate = (user, pass) => {
    return new Promise((resolve, reject) => {
      ad.find(`mail=${user}`, function (err, results) {
        if (err || !results) {
          console.log("ERROR: " + JSON.stringify(err));
          return reject(err || new Error("LDAP user lookup returned no results"));
        }

        ad.authenticate(
          results.users[0].userPrincipalName,
          pass,
          async (err, auth) => {
            if (err) {
              resolve([false]);
              return;
            }

            if (auth) {
              ad.findUser(
                results.users[0].userPrincipalName,
                (err, adUser) => {
                  resolve([auth, adUser]);
                }
              );
            } else {
              resolve([false]);
            }
          }
        );
      });
    });
  };
}
