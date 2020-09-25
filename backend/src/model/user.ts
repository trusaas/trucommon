import { Model, Optional, Sequelize, DataTypes,Op } from "sequelize";
import { TruUtil } from "../utils/tru-util";
import { TruAppConstants } from "../utils/tru-app-constants";
import { UserToken } from "./user-token";
import { TruData } from '../utils/tru-interfaces';
// These are all the attributes in the User model
interface UserAttributes {
    id: number;
    uniqueId: string | null;
    name: string| null;
    email: string;
    password: string| null;
    resetPasswordToken: string | null;
    resetPasswordSentAt: Date | null;
    confirmationToken: string | null;
    confirmationSentAt: Date | null;
    confirmedAt: Date | null;
    status: string | null;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

export class User extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    public id!: number;
    public uniqueId!: string | null;
    public name!: string| null;
    public email!: string;
    public password!: string| null;
    public resetPasswordToken: string | null;
    public resetPasswordSentAt: Date | null;
    public confirmationToken: string | null;
    public confirmationSentAt: Date | null;
    public confirmedAt: Date | null;
    public status: string | null;
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt: Date | null;
        
}
export const UserInit = (sequelize: Sequelize) => {
    User.init({
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        uniqueId:{
            type: DataTypes.STRING(6),
            allowNull: true,
            unique:'user_id_unique'
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique:'email_unique'
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        resetPasswordToken: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique:'reset_password_token_unique'
        },
        resetPasswordSentAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        confirmationToken: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique:'confirmation_token_unique'
        },
        confirmationSentAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        confirmedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING(45),
            allowNull: true
        }
    }, {
        paranoid: true,
        underscored: true,
        tableName: "user",
        sequelize: sequelize // this bit is important
    });
    //*
    User.beforeCreate(async (user: User, options) => {
        let uniqueId:string = TruUtil.generateRandomString();
        let _user: any = await User.findOne({ where: { uniqueId: uniqueId } });
        while (_user != null) {
            uniqueId = TruUtil.generateRandomString();
            _user = await User.findOne({ where: { uniqueId: uniqueId } });
        }
        user.uniqueId = uniqueId;
        if(user.password) user.password = TruUtil.getHash(TruUtil.decode(user.password));
        user.status = TruAppConstants.Status.ConfirmationPending;
        user.confirmationToken = TruUtil.uuidV1();
        user.confirmationSentAt = new Date();
    });
    //*/
    // TruUtil.error('User define and hook calling on every lambda call');
}