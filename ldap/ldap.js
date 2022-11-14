import ActiveDirectory from "activedirectory";
var config = {
  url: "ldap://172.16.17.130",
  baseDN: "dc=versil,dc=inc",
  bindDN: "nodeJS@versil.inc",
  bindCredentials: "Yecgaa2new3mahdi@@",
};
var ad = new ActiveDirectory(config);
var username = "mahdi.nemati@versil.inc";
var password = "Waezakmi2";
export class LDAP {
  static authenticate = (user, pass) => {
    return new Promise((resolve, error) => {
      ad.authenticate(user, pass, async (err, auth) => {
        if (err) {
          resolve([false]);
        }
        if (auth) {
          ad.getGroupMembershipForUser(user, (err, adUser) => {
            resolve([auth, adUser]);
          });
        } else {
          resolve([false]);
        }
      });
    });
  };
}

// console.log(await LDAP.authenticate(username, password));
