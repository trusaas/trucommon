'use strict';
import { TruData,TruUtil,TruServerMessages } from '../../utils'; 
import { BaseService } from '../base-service';
import { APIGatewayProxyResult } from 'aws-lambda';
import { HTTP_METHODS } from '../../handler/base-handler'; 
 
export class DashboardService extends BaseService{

    constructor(){
        super();
    }
    
    handler = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        if(trd.method===HTTP_METHODS.POST){
          switch (trd.pathParameters?.path) {
            case 'single':
              return await this.single(trd);
            case 'multi':
              return await this.multi(trd);
            case 'bubble':
              return await this.bubble(trd); 
          }
        }
        return TruUtil.AwsAPIGatewayProxyResult(404, false, TruServerMessages.ApiNotFound);   
    };
    single = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        return TruUtil.AwsAPIGatewayProxyResult(200,true,null,single);
    }
    multi = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        return TruUtil.AwsAPIGatewayProxyResult(200,true,null,multi);
    }
    bubble = async (trd: TruData):Promise<APIGatewayProxyResult> => { 
        return TruUtil.AwsAPIGatewayProxyResult(200,true,null,bubble);
    }            
}

const  single:any[] = [
    {
      "name": "Germany",
      "value": TruUtil.getRandomNumberBetween(100000,9999999)
    },
    {
      "name": "USA",
      "value": TruUtil.getRandomNumberBetween(100000,9999999)
    },
    {
      "name": "France",
      "value": TruUtil.getRandomNumberBetween(100000,9999999)
    }
  ];
  
  const  multi:any[]= [
    {
      "name": "Germany",
      "series": [
        {
          "name": "2010",
          "value": TruUtil.getRandomNumberBetween(100000,9999999)
        },
        {
          "name": "2011",
          "value": TruUtil.getRandomNumberBetween(100000,9999999)
        }
      ]
    },
  
    {
      "name": "USA",
      "series": [
        {
          "name": "2010",
          "value": TruUtil.getRandomNumberBetween(100000,9999999)
        },
        {
          "name": "2011",
          "value": TruUtil.getRandomNumberBetween(100000,9999999)
        }
      ]
    },
  
    {
      "name": "France",
      "series": [
        {
          "name": "2010",
          "value": TruUtil.getRandomNumberBetween(100000,9999999)
        },
        {
          "name": "2011",
          "value": TruUtil.getRandomNumberBetween(100000,9999999)
        }
      ]
    }
  ];
  const  bubble:any[]  =  [
    {
      name: 'Germany',
      series: [
        {
          name: '2010',
          x: '2010',
          y: 80.3,
          r: 80.4
        },
        {
          name: '2000',
          x: '2000',
          y: 80.3,
          r: 78
        },
        {
          name: '1990',
          x: '1990',
          y: 75.4,
          r: 79
        }
      ]
    },
    {
      name: 'United States',
      series: [
        {
          name: '2010',
          x: '2010',
          y: 78.8,
          r: 310
        },
        {
          name: '2000',
          x: '2000',
          y: 76.9,
          r: 283
        },
        {
          name: '1990',
          x: '1990',
          y: 75.4,
          r: 253
        }
      ]
    },
    {
      name: 'France',
      series: [
        {
          name: '2010',
          x: '2010',
          y: 81.4,
          r: 63
        },
        {
          name: '2000',
          x: '2000',
          y: 79.1,
          r: 59.4
        },
        {
          name: '1990',
          x: '1990',
          y: 77.2,
          r: 56.9
        }
      ]
    },
    {
      name: 'United Kingdom',
      series: [
        {
          name: '2010',
          x: '2010',
          y: 80.2,
          r: 62.7
        },
        {
          name: '2000',
          x: '2000',
          y: 77.8,
          r: 58.9
        },
        {
          name: '1990',
          x: '1990',
          y: 75.7,
          r: 57.1
        }
      ]
    }
  ];