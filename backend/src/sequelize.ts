import { Sequelize } from 'sequelize';
import { AccountInit, UserInit, UserAccountInit, UserTokenInit, User, UserAccount, Account, UserToken } from './model/index';
import { TruUtil } from './utils/tru-util';

export class TruSequelize {

    static Init = (): Sequelize => {
        const sequelize = new Sequelize(
            process.env.DB_NAME!,
            process.env.DB_USERNAME!,
            process.env.DB_PASSWORD!,
            {
                dialect: 'mysql',
                timezone: '+05:30',
                host: process.env.DB_HOST,
                port: parseInt((process.env.DB_PORT == undefined || process.env.DB_PORT == null) ? '3306' : process.env.DB_PORT),
                pool: JSON.parse(process.env.DB_POOL == undefined ? '{ "max": 5, "min": 0, "acquire": 30000, "idle": 10000}' : process.env.DB_POOL),
                logging: (process.env.DB_LOGS == undefined || process.env.DB_LOGS == null) ? false : ((process.env.DB_LOGS == 'true')?TruUtil.log:false),
            }
        );
        if (process.env.DB_SEQUELIZE_TEST_CONNECTION! === 'true') {
            (async () => {
                try {
                    sequelize.authenticate();
                    TruUtil.log('Connection has been established successfully.');
                } catch (error) {
                    TruUtil.error('Unable to connect to the database:', error);
                }
            })();
        }

        (AccountInit)(sequelize);
        (UserInit)(sequelize);
        (UserAccountInit)(sequelize);
        (UserTokenInit)(sequelize);

        User.hasMany(UserAccount, { as: "userAccounts", sourceKey: "id", foreignKey: "user_id" });
        UserToken.belongsTo(User, { as:"user", foreignKey: "user_id" });
        UserToken.hasMany(UserAccount,{ as: "userAccounts", sourceKey: "user_id", foreignKey: "user_id" });
        Account.hasMany(UserAccount, { as: "accountUsers", sourceKey: "id", foreignKey: "account_id" })
        UserAccount.belongsTo(Account, { as:"account", foreignKey: "account_id" });
        UserAccount.belongsTo(User, {as:"user", foreignKey: "user_id" });


        if (process.env.DB_SEQUELIZE_SYNC! === 'true') {
            (async () => {
                await sequelize.sync(JSON.parse(process.env.DB_SEQUELIZE_SYNC_OPTIONS == undefined ? '{ "force": false }' : process.env.DB_SEQUELIZE_SYNC_OPTIONS));
            })();
        }
        return sequelize;
    }
}