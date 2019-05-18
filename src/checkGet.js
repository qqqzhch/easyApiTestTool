import axios from 'axios';
import DB from './DB.js';
import _ from 'underscore';


function getAllJson(jsons,parantKey,resultList) {
    if(parantKey==undefined){
        parantKey=''
    }
    for(let key in jsons) {
        if(!(jsons[key] instanceof Object)){
            // console.log(parantKey+'.'+key + " is " + typeof jsons[key]); //如果不是Object则打印键值
            resultList.push({
                key:parantKey+'.'+key,
                value:typeof jsons[key]
            })
        }else{
            if(jsons[key]instanceof Array){
                getAllJson(jsons[key][0],parantKey+'.'+key+'[0]',resultList); //如果是Object则递归

            }else{
                getAllJson(jsons[key],parantKey+'.'+key,resultList); //如果是Object则递归
            }
            
        } 
    }
};


export default function(url){
   return  new Promise(function(resolve, reject){
        axios.get(url)
        .then(function (response) {
            var result={
                stateCode:null,
                
                resultType:[],
                url:url
            }
            console.log(response.status);
            // console.log(response.data);
            result.stateCode=response.status;
            // result.resultData=response.data;
            if(response.status==200){
                //bianli json
                 getAllJson(response.data,'',result.resultType);
                //  console.log(result.resultType)

            }
            DB.find({ url: url }, function (err, docs) {
                // docs is an array containing documents Mars, Earth, Jupiter
                // If no document is found, docs is equal to []
                //对结果进行对比校验
                var stateCode=null;
                var resultTypeNum=null;
                var resultTypeListError=[];
                if(docs.length==0){
                    DB.insert(result, function (err, newDocs) {
                        // Two documents were inserted in the database
                        // newDocs is an array with these documents, augmented with their _id
                      })
                      resolve({
                          code:1
                      })

                }else{
                    var doc=docs[0];
                    // console.log(doc);
                    if(doc.stateCode==result.stateCode){
                        stateCode = true;
                        if(doc.resultType.length==result.resultType.length){
                            resultTypeNum=true;

                            doc.resultType.forEach(function(item ){
                                // item.key
                                // item.value
                               var resultItem  = _.find(result.resultType,{
                                    key:item.key
                                })
                                if(resultItem ==undefined){
                                    resultTypeListError.push(item.key)
                                    return;
                                }
                                if(item.value!=resultItem.value){
                                    resultTypeListError.push(item.key)
                                    return;
                                }


                            })




                        }else{
                            resultTypeNum=false;
                        }

                    }else{
                        stateCode = false;
                    }
                    
                    
                    resolve({
                        code:2,
                        stateCode:stateCode,
                        resultTypeNum:resultTypeNum,
                        resultTypeListError:resultTypeListError
                    })

                }

              });
        })
        .catch(function (error) {
            console.log(error);
            reject(error);
        });

    })
    
};