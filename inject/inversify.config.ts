//@ts-ignore
import "reflect-metadata";

import { LogInterpreter } from './../services/LogInterpreter/LogInterpreter';
import { ILogInterpreter } from './../services/LogInterpreter/ILogInterpreter';
import { UserService } from './../services/UserService/UserService';
import { IUserService } from './../services/UserService/IUserService';
import { BasicService } from './../services/BasicService/BasicService';
import { IBasicService } from './../services/BasicService/IBasicService';
import { LogReader } from './../services/LogReader/LogReader';
import { ILogReader } from './../services/LogReader/ILogReader';
import { Container } from "inversify";
import { TYPES } from './TYPES';

const container = new Container();
container.bind<ILogInterpreter>(TYPES.ILogInterpreter).to(LogInterpreter);
container.bind<ILogReader>(TYPES.ILogReader).to(LogReader);
container.bind<IBasicService>(TYPES.IBasicService).to(BasicService);
container.bind<IUserService>(TYPES.IUserService).to(UserService);

export default container;
