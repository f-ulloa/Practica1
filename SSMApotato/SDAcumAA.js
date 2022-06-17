function SD() {

    let indicadoresTPM = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = indicadoresTPM.getSheetByName("Copia de SSMA 1");

    let numberFirstIndicador=5;//5
    let numberLastIndicador=39;//39s
    let columnasFYD=['CZ', 'DK']

    for (let index = numberFirstIndicador; index <= numberLastIndicador; index++) {
        let rangoAcumActual=`${columnasFYD[0]}${index}:${columnasFYD[1]}${index}`
        let Acum=`${sheet.getRange(rangoAcumActual).getFormulas()}`
        let AcumArreglado=Acum.replaceAll('""', '"SD"').split(',')
        //console.log(AcumArreglado)
        sheet.getRange(rangoAcumActual).setValues([AcumArreglado])        
    }
}