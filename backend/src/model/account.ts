import { Model, Optional, Sequelize, DataTypes } from "sequelize";
import { TruUtil } from "../utils/tru-util";
import { TruAppConstants } from "../utils/tru-app-constants";

// These are all the attributes in the Account model
interface AccountAttributes {
    id: number;
    name: string;
    appId: string | null;
    identitySecret: string | null;
    status: string | null;
}

// Some attributes are optional in `Account.build` and `Account.create` calls
interface AccountCreationAttributes extends Optional<AccountAttributes, 'id'> { }

export class Account extends Model<AccountAttributes, AccountCreationAttributes>
    implements AccountAttributes {
    public id!: number;
    public name!: string;
    public appId: string | null;
    public identitySecret: string | null;
    public status: string | null;
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt: Date | null;

}
export const AccountInit = (sequelize: Sequelize) => {
    Account.init({
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        appId: {
            type: DataTypes.STRING(45),
            allowNull: true,
            unique:'app_id_unique'
        },
        identitySecret: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        status: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
    }, {
        paranoid: true,
        underscored: true,
        tableName: "account",
        sequelize: sequelize // this bit is important
    });
    //*
    Account.beforeCreate(async (account: Account, options) => {
        let appId:string = TruUtil.generateRandomString();
        let _account: any = await Account.findOne({ where: { appId: appId } });
        while (_account != null) {
            appId = TruUtil.generateRandomString();
            _account = await Account.findOne({ where: { appId: appId } });
        }
        account.appId = appId;
        if(!account.status || account.status===null || account.status.trim()==='')
            account.status = TruAppConstants.Status.ConfirmationPending;
        account.identitySecret = TruUtil.uuidV1();
    });
    //*/
}