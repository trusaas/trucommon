import { Model, Sequelize, DataTypes } from "sequelize";
import { TruAppConstants } from "../utils/tru-app-constants";

// These are all the attributes in the UserAccount model
interface UserAccountAttributes {
    userId: number;
    accountId: number;
    role: string;
    status: string | null;
}


export class UserAccount extends Model<UserAccountAttributes>
    implements UserAccountAttributes {
    public userId!: number;
    public accountId!: number;
    public role!: string;
    public status: string | null;
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt: Date | null;
}
export const UserAccountInit = (sequelize: Sequelize) => {
    UserAccount.init({
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        accountId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'account',
                key: 'id'
            }
        },
        role: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(45),
            allowNull: true
        }
    }, {
        paranoid: true,
        underscored: true,
        tableName: "user_account",
        sequelize: sequelize // this bit is important
    });
    //*
    UserAccount.beforeCreate((userAccount: UserAccount, options) => {
        if(!userAccount.status || userAccount.status===null || userAccount.status.trim()==='')
            userAccount.status = TruAppConstants.Status.ConfirmationPending;
    });
    //*/
}