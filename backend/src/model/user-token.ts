import { Model, Optional, Sequelize, DataTypes,Op } from "sequelize";
import { TruAppConstants } from "../utils/tru-app-constants";
import { TruUtil } from "../utils/tru-util";
import { UserAccount } from "./user-account";

// These are all the attributes in the UserToken model
interface UserTokenAttributes {
    id: number;
    userId: number;
    token: string;
    ip: string;
    os: string | null;
    browser: string | null;
    agent: string | null;
    lastAccessedOn: Date;
    status: string | null;
}

// Some attributes are optional in `UserToken.build` and `UserToken.create` calls
interface UserTokenCreationAttributes extends Optional<UserToken, 'id'> { }

export class UserToken extends Model<UserTokenAttributes, UserTokenCreationAttributes>
    implements UserTokenAttributes {
    public id!: number;
    public userId!: number;
    public token!: string;
    public ip!: string;
    public os: string | null;
    public browser: string | null;
    public agent: string | null;
    public lastAccessedOn!: Date;
    public status: string | null;
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt: Date | null;
     
    public static verifySession = async (meta:any,token: string | null) =>{
        if(token === undefined || token === null || token.trim()==='') return null;
        let whereCond:any = {token:token}; 
        let userToken: any = await UserToken.findOne({
            attributes: ['id','token', 'ip', 'os', 'browser', 'agent', 'lastAccessedOn', 'status'],
            include:[{
                association: 'user', required: true,
                attributes: ['id','name', 'email','status','confirmationToken','confirmationSentAt']                          
            }],
            where: whereCond
        });
        if (userToken === undefined || userToken === null) {
            return null;
        }else{
            userToken = userToken.dataValues;
            let whereCond:any={userId:userToken.user.id};
            whereCond[Op.and]=[Sequelize.literal(`
            \`UserAccount\`.\`role\` = '${TruUtil.makeQueryPramVal(TruAppConstants.Role.AccountAdmin)}' OR
           (\`UserAccount\`.\`role\` = '${TruUtil.makeQueryPramVal(TruAppConstants.Role.Operator)}'   AND 
            \`UserAccount\`.\`status\` <> '${TruUtil.makeQueryPramVal(TruAppConstants.Status.ConfirmationPending)}'
           )` )];
            userToken.userAccounts = await UserAccount.findAll({
                attributes: ['role', 'status'],
                include: [{
                    association: 'account', required: true,
                    attributes: ['id','name', 'appId']                    
                }],
                where:whereCond
            });
            return userToken;
        }
    }    
}

export const UserTokenInit = (sequelize: Sequelize) => {
    UserToken.init({
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        token: {
            type: DataTypes.STRING(1024),
            allowNull: false
        },
        ip: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        os: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        browser: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        agent: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        lastAccessedOn: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING(45),
            allowNull: true
        }
    }, {
        paranoid: true,
        underscored: true,
        tableName: "user_token",
        sequelize: sequelize // this bit is important
    });
}