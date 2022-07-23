function agregarIndicadores(){
    /*
    Dado que los indicadore a agregar, son de la misma naturaleza que el indicador presente en SSMA, Dias Perdidos, los pasos seran los siguientes:

    1.- Agregamos 2 filas nuevas, igual a los indicadores a agregar
    2.- Copiar en las 2 filas, las formulas de los dias perdidos, pero modificando la celda referenciando a la del nuevo indicador
    3.- Arreglar la enumeracion de los indicadores del paso donde se agregaron los indicadores
    4.- Se le da un Nombre y el type en texto a los nuevos indicadores
    */
    
    let libro = SpreadsheetApp.getActiveSpreadsheet();
    nombreSheet="Antofagasta de SSMA"
    let sheet = libro.getSheetByName(nombreSheet);

  
    //------------------------------------------- 1.- Agregamos las 2 nuevas Filas-------------------------------
    sheet.insertRowAfter(13);
    sheet.insertRowAfter(13);
    //Unimos las celdas de AA, PPTO y YTD
    sheet.getRange(14,21,1,2).merge();
    sheet.getRange(14,23,1,2).merge();
    sheet.getRange(14,25,1,2).merge();
    sheet.getRange(15,21,1,2).merge();
    sheet.getRange(15,23,1,2).merge();
    sheet.getRange(15,25,1,2).merge();

    
    //---------------------------------------- 2.- Copiar en las 2 filas, las formulas de los dias perdidos-------------
    let lastColumn=sheet.getLastColumn()
    let FormulasDiasPerdidos = sheet.getRange(13,1,1,lastColumn).getFormulas()[0]
    let Formulas14=[]
    let Formulas15=[]

    //A las formulas se le modifica la celda a la que hace referencia, por la nuevas celdas de los indicadores a agregar correspondientemente
    for (let i=0; i<FormulasDiasPerdidos.length; i++){
      Formulas14.push(FormulasDiasPerdidos[i].replaceAll("13", "14"))
      Formulas15.push(FormulasDiasPerdidos[i].replaceAll("13", "15"))
    }

    sheet.getRange(14,1,1,lastColumn).setFormulas([Formulas14])
    sheet.getRange(15,1,1,lastColumn).setFormulas([Formulas15])


    //------------------------------------ 3.- Arreglar la enumeracion de los indicadores --------------------------------------------
    let RangoCodIndicadores=sheet.getRange("B16:B21")
    let CodIndicadores=RangoCodIndicadores.getValues()
    let unidad="1";
    let contadorSecundario=10; 
    for (let i=0; i<CodIndicadores.length; i++){
      CodIndicadores[i]=[unidad+`.${contadorSecundario++}`];
    } 
    RangoCodIndicadores.setValues(CodIndicadores);


    //----------------------------------- 4.- Se le da un Nombre y el type en texto a los nuevos indicadores ----------------------------
    sheet.getRange("B14").setValue("1.8");
    sheet.getRange("B15").setValue("1.9");
    let KPI = sheet.getRange("C13").getValue();
    sheet.getRange("C14").setValue(KPI);
    sheet.getRange("C15").setValue(KPI);
    sheet.getRange("D14").setValue("Días perdidos Int.")
    sheet.getRange("E14").setValue("#Días perdidos (Int.)")
    sheet.getRange("D15").setValue("Días perdidos Ext.")
    sheet.getRange("E15").setValue("#Días perdidos (Ext.)")
}