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
          console.error("LDAP user lookup failed");
          return reject(err || new Error("LDAP user lookup returned no results"));
        }

        const user = results?.users?.[0];
        if (!user?.userPrincipalName) {
          return resolve([false]);
        }

        ad.authenticate(
          user.userPrincipalName,
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
                  if (err || !adUser || typeof adUser !== "object") {
                    reject(new Error("LDAP user-detail lookup failed"));
                    return;
                  }
                  resolve([true, adUser]);
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
