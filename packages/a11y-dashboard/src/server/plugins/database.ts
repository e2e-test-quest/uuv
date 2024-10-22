import { Model, Sequelize, DataTypes } from 'sequelize';

export default defineNitroPlugin((nitroApp) => {
  try {

    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './a11y-dashboard.sqlite'
    });

    class App extends Model {}
    App.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        }
    }, {
        sequelize,
        tableName: 'App',
        freezeTableName: true,
        timestamps: false,
        indexes: [
            {
            unique: true,
            fields: ['name']
            }
        ],
    });

    class Usecase extends Model {}
    Usecase.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        script: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        locationFile: {
            type: DataTypes.STRING,
        },
        locationLine: {
            type: DataTypes.INTEGER,
        },
        locationColumn: {
            type: DataTypes.INTEGER,
        },
        location: {
            type: DataTypes.VIRTUAL,
            get() {
                return {
                    file: this.getDataValue('locationFile'),
                    line: this.getDataValue('locationLine'),
                    column: this.getDataValue('locationColumn')
                };
            },
            set(value) {
                this.setDataValue('locationFile', value.file);
                this.setDataValue('locationLine', value.line);
                this.setDataValue('locationColumn', value.column);
            },
        },
        lastResultCounter: {
            type: DataTypes.VIRTUAL,
            get() {
                return this.getDataValue('lastResult')?.issues ? {
                    error: this.getDataValue('lastResult').issues.filter(issue => issue.type === 'error').length,
                    warning: this.getDataValue('lastResult').issues.filter(issue => issue.type === 'warning').length,
                    notice: this.getDataValue('lastResult').issues.filter(issue => issue.type === 'notice').length
                } : null;
            },
        }
    }, { 
        sequelize,
        tableName: 'Usecase',
        modelName: 'Usecases',
        freezeTableName: true,
        timestamps: false, 
        indexes: [
            {
            unique: true,
            fields: ['appId', 'name', 'locationFile'],
            }
        ],
        defaultScope: {
            attributes: {
                exclude: [
                    'locationFile',
                    'locationLine',
                    'locationColumn'
                ]
            }
        }
    });
    App.hasMany(Usecase, {as: 'usecases'});
    Usecase.belongsTo(App);

    class Result extends Model {}
    Result.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize,
        tableName: 'Result',
        freezeTableName: true,
        timestamps: false
    });
    Usecase.hasMany(Result, {as: 'results'});
    Result.belongsTo(Usecase);
    Usecase.hasOne(Result, {
        as: 'lastResult',
        foreignKey: 'UsecaseId',
        scope: {
        date: sequelize.literal('date in (SELECT MAX(date) FROM Result WHERE Result.usecaseId = Usecases.id)'),
        }
    });

    class AccessibilityIssue extends Model {}
    AccessibilityIssue.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        selector: {
            type: DataTypes.TEXT, // Stored as JSON string
        },
        runnerExtrasDescription: {
            type: DataTypes.TEXT,
        },
        runnerExtrasImpact: {
            type: DataTypes.STRING,
        },
        runnerExtrasHelp: {
            type: DataTypes.TEXT,
        },
        runnerExtrasHelpUrl: {
            type: DataTypes.TEXT,
        },
        runnerExtras: {
            type: DataTypes.VIRTUAL,
            get() {
                return {
                    description: this.getDataValue('runnerExtrasDescription'),
                    impact: this.getDataValue('runnerExtrasImpact'),
                    help: this.getDataValue('runnerExtrasHelp'),
                    helpUrl: this.getDataValue('runnerExtrasHelpUrl')
                };
            },
            set(value) {
                this.setDataValue('runnerExtrasDescription', value.description);
                this.setDataValue('runnerExtrasImpact', value.impact);
                this.setDataValue('runnerExtrasHelp', value.help);
                this.setDataValue('runnerExtrasHelpUrl', value.helpUrl);
            },
        }
    }, {
        sequelize,
        tableName: 'AccessibilityIssue',
        freezeTableName: true,
        timestamps: false,
        getterMethods: {
            runnerExtrasDescription: function () {return undefined;},
            runnerExtrasImpact: function () {return undefined;},
            runnerExtrasHelp: function () {return undefined;},
            runnerExtrasHelpUrl: function () {return undefined;}
        }
    });
    Result.hasMany(AccessibilityIssue, {as: 'issues'});
    AccessibilityIssue.belongsTo(Result);

    sequelize.sync();
    console.log("DB connection established.");

    nitroApp.hooks.hook('request', (event) => {
        event.context.$models = {
            App,
            Usecase,
            Result,
            AccessibilityIssue
        };
    });
  } catch (err) {
    console.error("DB connection failed.", err);
  }
});
