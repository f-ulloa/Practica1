function myFunction() {
    let libroPruebitas = SpreadsheetApp.getActiveSpreadsheet();
    let tasaAccidentes = libroPruebitas.getSheetByName("Copia de TASAACC");
  
    let columnasMeses=['P', 'Z'];//Desde segundo Año de datos hasta el ultimo Z + shift
    let primerMesDato='C';//Primer Mes del primer Año de datos
    let filasTramosTasas=[[59,86], [137,160], [209,231]];
  
    let indexColumna=columnasMeses[0].charCodeAt(0);
    let indexFinal=1+columnasMeses[1].charCodeAt(0);//Shift + Z
    
  
    let Tramos=filasTramosTasas.length;
    for (let w = 0; w < Tramos; w++) {
      let filasTramoTasa=filasTramosTasas[w];
      let delta=1+filasTramoTasa[1]-filasTramoTasa[0];
      let filaTramoHead=[filasTramoTasa[0]-delta,filasTramoTasa[0]-1];
      let filaTramoId=[filaTramoHead[0]-delta,filaTramoHead[0]-1]
      let contador=0;
      for(let z=filasTramoTasa[0]; z<=filasTramoTasa[1]; z++){
        let FilaAccinterno=filaTramoId[0]+z-filasTramoTasa[0];
        let FilaHeadCount=filaTramoHead[0]+z-filasTramoTasa[0];
        for (let i=indexFinal;i>=indexColumna;i--){
          ///let columaActual=String.fromCharCode(i)
          let columnaInicio=String.fromCharCode(i);///i-1
          let columnaFin=String.fromCharCode(i-11);
          if(columnaInicio<primerMesDato){columnaInicio=primerMesDato;}
          if(columnaInicio>'Z'){columnaInicio='A'+String.fromCharCode(i-26);}
          if(columnaFin<primerMesDato){columnaFin=primerMesDato;}
          if(columnaFin>'Z'){columnaFin='A'+String.fromCharCode(i-11-26);}
          let rangeColumnaInicio=`${columnaInicio}${filaTramoId[0]}:${columnaInicio}${filaTramoHead[1]}`;
          let doceMesesIndicador=`${columnaInicio}${filaTramoId[0]+contador}:${columnaFin}${filaTramoId[0]+contador}`;
          let doceMesesHead=`${columnaInicio}${filaTramoHead[0]+contador}:${columnaFin}${filaTramoHead[0]+contador}`;
          let value=`=IF(AND(NOT(ISBLANK(${columnaInicio}${FilaAccinterno}));NOT(ISBLANK(${columnaInicio}${FilaHeadCount})) );IFERROR((SUM(${doceMesesIndicador})*100)/AVERAGE(${doceMesesHead}); "SD");)`;
          if(z==filasTramoTasa[1]){
            value=`=IF(COUNTBLANK(${rangeColumnaInicio})<${parseInt((1/3)*(2*delta))};IFERROR((SUM(${doceMesesIndicador})*100)/AVERAGE(${doceMesesHead}); "SD");)`;
          }
          let posicionTasa=`${columnaInicio}${filasTramoTasa[0]+contador}`;
          tasaAccidentes.getRange(posicionTasa).setValue(value);
        }
        contador+=1;
      }
    }
  }
  