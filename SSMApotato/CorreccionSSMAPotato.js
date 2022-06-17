function myFunction() {

      let numberFirstIndicador=5;//Fila
      let numberLastIndicador=39;//Fila
      let columnaColorType='F';//F
      let columnaSymbolType='E';//E
      let columnasIndicadores=['G','R'];//G,R
      let columnasPropuesto=['BD','BO'];//AD,AO
      let columnasFYD=['CZ','DK'];//CZ,DK ; FYD:FinalYearDatos <=> AcumAA
      let colorCreciente="#d9ead3";
      let colorDecreciente="#f4cccc";
      let columnaFYDseleccionado=["Y", "Z"];
      let columnaAA="U";
      let columnaAPPTO="W";

      let indicadoresTPM = SpreadsheetApp.getActiveSpreadsheet();
      let sheet = indicadoresTPM.getSheetByName("Copia de SSMA 1");
      sheet.clearConditionalFormatRules();
      let rangoIndicadores=[];//Regla CeldaVacia y SD
      let rangoTypePorcental=[];//naturalezaDatosPorcentual
      let firstCreciente='', firstDecreciente='';// Posiciones para Formulas de rules indicadores
      let rangoIndicadoresValuesCrecientes=[];//Potatos indicadores Crecientes
      let rangoIndicadoresValuesDecreciente=[];//Potatos indicadores Decrecientes
      let seleccionadoCreciente, seleccionadoDecreciente;// Posiciones para formulas Resumen rulesYTD, por mes seleccionado 
      let rangoYTDseleccionadoCreciente=[];//Potato YTD creciente
      let rangoYTDseleccionadoDecreciente=[];//Potato YTD decreciente
      ///-------------------------

      for(let i=numberFirstIndicador; i<=numberLastIndicador;i++){
            color=sheet.getRange(`${columnaColorType}${i}`).getBackground();
            type=sheet.getRange(`${columnaSymbolType}${i}`).getValue();
            indicadorActual=sheet.getRange(`${columnasIndicadores[0]}${i}:${columnasIndicadores[1]}${i}`);
            rangoIndicadores.push(indicadorActual);
            FYDseleccionado=sheet.getRange(`${columnaFYDseleccionado[0]}${i}:${columnaFYDseleccionado[1]}${i}`)
            
            if(color==colorCreciente){
                  rangoIndicadoresValuesCrecientes.push(indicadorActual);
                  rangoYTDseleccionadoCreciente.push(FYDseleccionado)
                  if(firstCreciente==''){
                        firstCreciente=[`${columnasIndicadores[0]}${i}:${columnasIndicadores[1]}${i}`,`${columnasFYD[0]}${i}`, `${columnasPropuesto[0]}${i}`, `${columnasPropuesto[0]}${i}:${columnasPropuesto[1]}${i}`];
                        seleccionadoCreciente=[`${columnaFYDseleccionado[0]}${i}`,`${columnaAA}${i}`,`${columnaAPPTO}${i}`] ;
                        console.log(firstCreciente, seleccionadoCreciente);
                  }
                  if(type=='%'){rangoTypePorcental.push(indicadorActual);}
            }
            else if(color==colorDecreciente){
                  rangoIndicadoresValuesDecreciente.push(indicadorActual);
                  rangoYTDseleccionadoDecreciente.push(FYDseleccionado);
                  if(firstDecreciente==''){
                        firstDecreciente=[`${columnasIndicadores[0]}${i}:${columnasIndicadores[1]}${i}`,`${columnasFYD[0]}${i}`, `${columnasPropuesto[0]}${i}`, `${columnasPropuesto[0]}${i}:${columnasPropuesto[1]}${i}`];
                        seleccionadoDecreciente=[`${columnaFYDseleccionado[0]}${i}`,`${columnaAA}${i}`,`${columnaAPPTO}${i}`] ;
                        console.log(firstDecreciente, seleccionadoDecreciente);
                  }
                  if(type=='%'){rangoTypePorcental.push(indicadorActual);}
            }
      }

      //Arreglando SD de FYD
      for (let index = numberFirstIndicador; index <= numberLastIndicador; index++) {
            let rangoAcumActual=`${columnasFYD[0]}${index}:${columnasFYD[1]}${index}`
            let Acum=`${sheet.getRange(rangoAcumActual).getFormulas()}`
            let AcumArreglado=Acum.replaceAll('""', '"SD"').split(',')
            sheet.getRange(rangoAcumActual).setValues([AcumArreglado])        
      }
      
      //-------------Reglas Globales-----------------------
      // Celda vacia
      let ruleCeldaVacia=SpreadsheetApp.newConditionalFormatRule() 
      .whenCellEmpty()
      .setBackground("#FFFFFF")
      .setFontColor('#000000')
      .setRanges(rangoIndicadores)
      .build();

      let ruleSD=SpreadsheetApp.newConditionalFormatRule() 
            .whenTextEqualTo("SD")
            .setBackground("#ADADAD")
            .setFontColor('#FFFFFF')
            .setRanges(rangoIndicadores)
            .build();
      
      
      //----------Resumen Mes Actual
      let rangeResumen=[sheet.getRange(`${columnasIndicadores[0]}${numberFirstIndicador-2}:${columnasIndicadores[1]}${numberFirstIndicador-2}`)];
      let ruleTextoVacia=SpreadsheetApp.newConditionalFormatRule() 
            .whenCellEmpty()
            .setBackground("#ADADAD")
            .setFontColor('#FFFFFF')
            .setRanges(rangeResumen)
            .build();

      let ruleTextoER=SpreadsheetApp.newConditionalFormatRule() 
            .whenTextEqualTo("ER")
            .setBackground("#F7FF00")
            .setFontColor('#FF0000')
            .setRanges(rangeResumen)
            .build();

      let ruleTextoOK=SpreadsheetApp.newConditionalFormatRule() 
            .whenTextEqualTo("OK")
            .setBackground("#34A853")
            .setFontColor('#FFFFFF')
            .setRanges(rangeResumen)
            .build();

      let ruleMayorIgual30=SpreadsheetApp.newConditionalFormatRule() 
            .whenNumberGreaterThanOrEqualTo(0.3)
            .setBackground("#ffe599")
            .setFontColor('#000000')
            .setRanges(rangeResumen)
            .build();

      let ruleMayor0=SpreadsheetApp.newConditionalFormatRule() 
            .whenNumberGreaterThanOrEqualTo(0)
            .setBackground("#ea9999")
            .setFontColor('#000000')
            .setRanges(rangeResumen)
            .build();

      //Tipo de indicadores datos Porcentaje
      let naturalezaDatosPorcentual=SpreadsheetApp.newConditionalFormatRule() 
            .whenTextDoesNotContain('%')
            .setBackground("#F7FF00")
            .setFontColor('#FF0000')
            .setRanges(rangoTypePorcental)
            .build();
      
      //------------------------------------------------------Reglas Potato Crecientes-------------------------------
      let [Cindicadores, CprimerFYD, CprimerPpto]=firstCreciente;  
      //------------Regla VerdeCreciente ----------------
      let ruleVerdeCreciente = SpreadsheetApp.newConditionalFormatRule()
            .whenFormulaSatisfied(`=AND(${Cindicadores}>=${CprimerPpto}; NOT(${CprimerPpto}="SD"); NOT(ISBLANK(${CprimerPpto})) ) `)
            .setBackground("#b7e1cd")
            .setRanges(rangoIndicadoresValuesCrecientes)
            .build();
      //-------------Regla AmarrilloCreciente -------------------------
      let ruleAmarrilloCreciente = SpreadsheetApp.newConditionalFormatRule()
            .whenFormulaSatisfied(`=OR(
                  AND( 
                        AND(${Cindicadores}>${CprimerFYD}; NOT(${CprimerFYD}="SD");NOT(ISBLANK(${CprimerFYD})) );
                        AND(${Cindicadores}<${CprimerPpto}; NOT(${CprimerPpto}="SD");NOT(ISBLANK(${CprimerPpto})) )
                  );
                  AND(
                        AND(${Cindicadores}>${CprimerFYD};  NOT(${CprimerFYD}="SD");NOT(ISBLANK(${CprimerFYD})) );
                        OR( ISBLANK(${CprimerPpto}); ${CprimerPpto}="SD" ) 
                  );
                  AND(
                        AND(${Cindicadores}<${CprimerPpto};  NOT(${CprimerPpto}="SD");NOT(ISBLANK(${CprimerPpto})) );
                        OR( ISBLANK(${CprimerFYD}); ${CprimerFYD}="SD" ) 
                  )
            )`)
            .setBackground("#fff2cc")
            .setRanges(rangoIndicadoresValuesCrecientes)
            .build();
      //------------Regla RojoCreciente ----------------
      let ruleRojoCreciente = SpreadsheetApp.newConditionalFormatRule()
            .whenFormulaSatisfied(`=AND(${Cindicadores}<=${CprimerFYD}; NOT(${CprimerFYD}="SD"); NOT(ISBLANK(${CprimerFYD})) )`)
            .setBackground("#f4cccc")
            .setRanges(rangoIndicadoresValuesCrecientes)
            .build(); 

      //--------------------------------------------------------Decrecientes-------------------------------
      let [Dindicadores, DprimerFYD, DprimerPpto]=firstDecreciente;  
      //------------Regla VerdeDecreciente ----------------
      let ruleVerdeDecreciente = SpreadsheetApp.newConditionalFormatRule()
            .whenFormulaSatisfied(`=AND(${Dindicadores}<=${DprimerPpto}; NOT(AND(${DprimerPpto}="SD";ISBLANK(${DprimerPpto}) )) ) `)
            .setBackground("#b7e1cd")
            .setRanges(rangoIndicadoresValuesDecreciente)
            .build();
      //-------------Regla AmarrilloDecreciente -------------------------
      let ruleAmarrilloDecreciente = SpreadsheetApp.newConditionalFormatRule()
            .whenFormulaSatisfied(`=OR( 
                  AND(
                        AND(${DprimerFYD}>${Dindicadores}; NOT(${DprimerFYD}="SD");NOT(ISBLANK(${DprimerFYD})) ); 
                        AND(${Dindicadores}>${DprimerPpto}; NOT(${DprimerPpto}="SD");NOT(ISBLANK(${DprimerPpto})) )
                  ); 
                  AND(
                        AND(${DprimerFYD}>${Dindicadores}; NOT(${DprimerFYD}="SD"); NOT(ISBLANK(${DprimerFYD})) );
                        OR( ISBLANK(${DprimerPpto}); ${DprimerPpto}="SD" )
                  );
                  AND(
                        AND(${Dindicadores}>${DprimerPpto}; NOT(${DprimerPpto}="SD"); NOT(ISBLANK(${DprimerPpto})) );
                        OR( ISBLANK(${DprimerFYD}); ${DprimerFYD}="SD" )
                  )
            )`)
            .setBackground("#fff2cc")
            .setRanges(rangoIndicadoresValuesDecreciente)
            .build();
      //------------Regla RojoDecreciente ----------------
      let ruleRojoDecreciente = SpreadsheetApp.newConditionalFormatRule()
            .whenFormulaSatisfied(`=AND(${Dindicadores}>=${DprimerFYD}; NOT(${DprimerFYD}="SD"); NOT(ISBLANK(${DprimerFYD})) )`)
            .setBackground("#f4cccc")
            .setRanges(rangoIndicadoresValuesDecreciente)
            .build();
      

      //------------------------------------Potato clase mundial------------------------------
      //Crecientes
      let [CFYDs, CAA, CPPTOact]=seleccionadoCreciente;
      //let CFYDs=CFYDs2[0];
      //.whenFormulaSatisfied(`=AND(${CFYDs}>${CPPTOact}, NOT(ISBLANK(${CFYDs})),NOT(${CFYDs}="SD"), NOT(ISBLANK(${CPPTOact})),  NOT(${CPPTOact}="SD") )`)
      let ruleYTDVerdeCreciente= SpreadsheetApp.newConditionalFormatRule()
            .whenFormulaSatisfied(`=AND(${CFYDs}>=${CPPTOact}; NOT(ISBLANK(${CFYDs}));NOT(${CFYDs}="SD"); NOT(ISBLANK(${CPPTOact}));  NOT(${CPPTOact}="SD") )`)
            .setBackground("#b7e1cd")
            .setRanges(rangoYTDseleccionadoCreciente)
            .build();
      let ruleYTDAmarilloCreciente= SpreadsheetApp.newConditionalFormatRule()
            .whenFormulaSatisfied(`=OR(
                        AND(
                              AND(${CFYDs}<${CPPTOact}; NOT(ISBLANK(${CFYDs})); NOT(${CFYDs}="SD"); NOT(AND(ISBLANK(${CPPTOact});${CPPTOact}="SD"))) ; 
                              AND(${CFYDs}>${CAA}; NOT(ISBLANK(${CFYDs})); NOT(${CFYDs}="SD"); NOT(ISBLANK(${CAA})); NOT(${CAA}="SD"))
                        );
                        AND(
                              AND(${CFYDs}<${CPPTOact}; NOT(ISBLANK(${CFYDs})); NOT(${CFYDs}="SD"); NOT(AND(ISBLANK(${CPPTOact});${CPPTOact}="SD"))) ; 
                              OR( ISBLANK(${CAA}); ${CAA}="SD" )
                        );
                        AND(
                              AND(${CFYDs}>${CAA}; NOT(ISBLANK(${CFYDs})); NOT(${CFYDs}="SD"); NOT(ISBLANK(${CAA})); NOT(${CAA}="SD") ); 
                              OR( ISBLANK(${CPPTOact}); ${CPPTOact}="SD" )
                        )
            )`)
            .setBackground("#fff2cc")
            .setRanges(rangoYTDseleccionadoCreciente)
            .build();

      let ruleYTDRojoCreciente = SpreadsheetApp.newConditionalFormatRule()
             .whenFormulaSatisfied(`=AND(${CFYDs}<=${CAA}, NOT(ISBLANK(${CFYDs})); NOT(${CFYDs}="SD"); NOT(ISBLANK(${CAA})); NOT(${CAA}="SD"))`)
            .setBackground("#f4cccc")
            .setRanges(rangoYTDseleccionadoCreciente)
            .build();

      
      //Decrecientes
      let [DFYDs, DAA, DpptoAct]=seleccionadoDecreciente;
      ruleYTDVerdeDecreciente= SpreadsheetApp.newConditionalFormatRule()
            .whenFormulaSatisfied(`=AND(${DFYDs}<=${DpptoAct}; NOT(ISBLANK(${DFYDs}));NOT(${DFYDs}="SD"); NOT(ISBLANK(${DpptoAct}));  NOT(${DpptoAct}="SD") )`)
            .setBackground("#b7e1cd")
            .setRanges(rangoYTDseleccionadoDecreciente)
            .build();

      ruleYTDAmarilloDecreciente= SpreadsheetApp.newConditionalFormatRule()
            .whenFormulaSatisfied(`=OR(
                  AND(
                        AND(${DFYDs}>${DpptoAct}; NOT(ISBLANK(${DFYDs})); NOT(${DFYDs}="SD"); NOT(ISBLANK(${DpptoAct})); NOT(${DpptoAct}="SD"))  ; 
                        AND(${DFYDs}<${DAA}; NOT(ISBLANK(${DFYDs})); NOT(${DFYDs}="SD"); NOT(ISBLANK(${DAA})); NOT(${DAA}="SD") )
                  );
                  AND(
                        AND(${DFYDs}>${DpptoAct}; NOT(ISBLANK(${DFYDs})); NOT(${DFYDs}="SD"); NOT(AND(ISBLANK(${DpptoAct});${DpptoAct}="SD"))) ; 
                        OR( ISBLANK(${DAA}); ${DAA}="SD" )
                  );
                  AND(
                        AND(${DFYDs}<${DAA}; NOT(ISBLANK(${DFYDs})); NOT(${DFYDs}="SD"); NOT(ISBLANK(${DAA})); NOT(${DAA}="SD") ); 
                        OR( ISBLANK(${DpptoAct}); ${DpptoAct}="SD" )
                  )
            )`)
            .setBackground("#fff2cc")
            .setRanges(rangoYTDseleccionadoDecreciente)
            .build();

      ruleYTDRojoDecreciente = SpreadsheetApp.newConditionalFormatRule()
            .whenFormulaSatisfied(`=AND(${DFYDs}>=${DAA}; NOT(ISBLANK(${DFYDs})); NOT(${DFYDs}="SD"); NOT(ISBLANK(${DAA})); NOT(${DAA}="SD") )`)
            .setBackground("#f4cccc")
            .setRanges(rangoYTDseleccionadoDecreciente)
            .build();

      //Regulas Globales
      let rules = sheet.getConditionalFormatRules();
      rules.push(ruleCeldaVacia);
      rules.push(ruleSD);
      //Resumen Meses
      rules.push(ruleTextoVacia, ruleTextoER,ruleTextoOK );
      rules.push(ruleMayorIgual30, ruleMayor0);
      //Naturaleza Porcentual
      rules.push(naturalezaDatosPorcentual);
      //Indices Potato
            //Crecientes
      rules.push(ruleVerdeCreciente, ruleAmarrilloCreciente, ruleRojoCreciente);
            //Decrecientes
      rules.push(ruleVerdeDecreciente, ruleAmarrilloDecreciente, ruleRojoDecreciente);
      //Reglas YTD resumen por mes seleccionado
      rules.push(ruleYTDVerdeCreciente, ruleYTDAmarilloCreciente, ruleYTDRojoCreciente);
      rules.push(ruleYTDVerdeDecreciente, ruleYTDAmarilloDecreciente, ruleYTDRojoDecreciente);
      
      sheet.setConditionalFormatRules(rules);
}
    