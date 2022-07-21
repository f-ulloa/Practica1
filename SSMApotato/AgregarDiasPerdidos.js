function agregarIndicadores(){
    /*
    1.- Agregar 2 filas nuevas
    2.- Copiar en las 2 filas nuevas, la fila de dias perdidos
    3.-Limpiar los valores de las nuevas filas
    4.-Cambiar los nombres de las nuevas Filas

    */
    let libro = SpreadsheetApp.getActiveSpreadsheet();
    nombreSheet="Antofagasta de SSMA"
    let sheet = libro.getSheetByName(nombreSheet);

    
    //Arreglamos la formula del estado del mes
    let RangoEstadoMes=sheet.getRange("G49:R49")
    let formulas = RangoEstadoMes.getFormulas()[0]
    let newFormulas=[]
    for (const iterator of formulas) {newFormulas.push(iterator.replaceAll("35", "COUNTA(asRangoIndicadores)"))}
    RangoEstadoMes.setFormulas([newFormulas]);


    //Agregamos las 2 nuevas Filas
    sheet.insertRowAfter(13);
    sheet.insertRowAfter(13);
    //Unimos las celdas de AA, PPTO y YTD
    sheet.getRange(14,21,1,2).merge();
    sheet.getRange(14,23,1,2).merge();
    sheet.getRange(14,25,1,2).merge();
    sheet.getRange(15,21,1,2).merge();
    sheet.getRange(15,23,1,2).merge();
    sheet.getRange(15,25,1,2).merge();

    
    //Le damos nombre y Type text a los nuevos indicadores
    let KPI = sheet.getRange(13,3).getValues()
    sheet.getRange(14,3).setValues(KPI);
    sheet.getRange(15,3).setValues(KPI);
    sheet.getRange("D14").setValue("Días perdidos Int.")
    sheet.getRange("E14").setValue("#Días perdidos (Int.)")
    sheet.getRange("D15").setValue("Días perdidos Ext.")
    sheet.getRange("E15").setValue("#Días perdidos (Ext.)")
    
    //Copiamos el valor de las formulas
    let lastColumnDatos=35
    let lastColumn=117
    let FormulasDiasPerdidos = sheet.getRange(13,7,1,lastColumn).getFormulas()[0]
    let Formulas14=[]
    let Formulas15=[]

    for (let i=0; i<FormulasDiasPerdidos.length; i++){
      Formulas14.push(FormulasDiasPerdidos[i].replaceAll("13", "14"))
      Formulas15.push(FormulasDiasPerdidos[i].replaceAll("13", "15"))
    }


    sheet.getRange(14,7,1,lastColumn).setFormulas([Formulas14])
    sheet.getRange(15,7,1,lastColumn).setFormulas([Formulas15])





    //Arreglamos la enumeracion de los indicadores
   
   
    //Arreglamos la formula del estado del mes
    
    
 /*
 */

}