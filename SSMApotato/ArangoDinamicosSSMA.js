function ArangoDinamicosSSMA(parNombreURL) {
    /*
    Para utilizar este script se debe modificar:
    M1.-Los rango de los DATOS por periodo Tiempo ((AR5:BC39)->Real, (BP5:CA39)->RealAA, etc)
    M2.-Celdas de escrituras, para generar el rango dinamico a exportar
    M3.-Las celdas con el Nombre del Tramo (Ej: AR3->Real ; BD3->PPTO, etc)

    Los pasos de este Script son:
     1.-Definir los rango de los tramos de datos y asociarlos a un rango con nombre
     2.- Definir las celdas donde se escribiran los campos de la tabla de exportacion
     3.- Escribir las formulas para cada columna de la tabla de exportacion
     4.-Creamos la celda que contiene el rango dinamico export, y lo asociamos al rango con nombre Export, para que al modificar los indicadores, el rango export se actualice.
     5.- Cambiar las formulas de SSMA, para que trabajen con los rangos con nombre
    */

    let URLL=parNombreURL.URLcopia
    let nombrePlanta=parNombreURL.NombrePlanta

    let libro = SpreadsheetApp.openByUrl(URLL)
    let nombreSheet="SSMA"
    
    
    let sheet = libro.getSheetByName(nombreSheet);
    //Eliminar los elementos y formato de la tabla de exportacion anterior.
    sheet.getRange("B68:P278").clear()

    //---------------------- 1.-Definir los rango de los tramos de datos y asociarlos a un rango con nombre ----------------------------
    //###### M1 #####
    let rangoIndicadores=sheet.getRange('D5:D39')
    let rangoReal=sheet.getRange('AR5:BC39')
    let rangoPPTO=sheet.getRange('AD5:AO39')
    let rangoRealAA=sheet.getRange('BP5:CA39')
    let rangoAcum=sheet.getRange('CB5:CM39')
    let rangoAcumPPTO=sheet.getRange('CN5:CY39')
    let rangoAcumAA=sheet.getRange('CZ5:DK39')
    libro.setNamedRange('asRangoIndicadores', rangoIndicadores);
    libro.setNamedRange('asRangoReal', rangoReal);
    libro.setNamedRange('asRangoPPTO', rangoPPTO);
    libro.setNamedRange('asRangoRealAA', rangoRealAA);
    libro.setNamedRange('asRangoAcum', rangoAcum);
    libro.setNamedRange('asRangoAcumPPTO', rangoAcumPPTO);
    libro.setNamedRange('asRangoAcumAA', rangoAcumAA);


    //Corremos de lugar la tabla de Rango mes, ya que la tabla export al crecer hacia abajo, se toparan
    let TablaNumMes=sheet.getRange("D285:E296").getValues();
    sheet.getRange("D285:E296").clear();
    sheet.getRange("Y70:Z81").clear()
    sheet.getRange("Y70:Z81").setValues(TablaNumMes);
    libro.setNamedRange('asRangoNumMes', sheet.getRange("Y70:Z81"));

    

    //2.-Celdas en donde se agregaran las etiquetas correspondientes a los datos a importar
    //###### M2 #####
    //Abstraer las celdas en fila columna, para mejor comprension de las formulas
    let filaEscritura=69;
    let columnaEncabezado='A';
    let columnaPlanta='A'
    let columnaBuscador='B'
    let columnaAño='C'
    let columnaTipo='D'
    let columnaIndicador='E'
    let columnaImportRange='F'
    let columnaBuscador2='R'
    let columnaExport='A'
    let celdaEscrituraEncabezados=columnaEncabezado+`${filaEscritura-1}`;//Donde se escribiran los encabezados
    let celdaEscrituraPlanta=columnaPlanta+`${filaEscritura}`; 
    let celdaEscituraBuscador=columnaBuscador+`${filaEscritura}`;
    let celdaEscrituraAño=columnaAño+`${filaEscritura}`; 
    let celdaEscrituraTipo=columnaTipo+`${filaEscritura}`; 
    let celdaEscrituraIndicador=columnaIndicador+`${filaEscritura}`;
    let celdaEscrituraImportRange=columnaImportRange+`${filaEscritura}`;//Donde se importaran los datos con import Range
    let celdaEscrituraBuscador2=columnaBuscador2+`${filaEscritura}`;
    let celdaEscrituraExport=columnaExport+`${filaEscritura-2}`;

    //###### M3 #####
    //Indicar las celdas donde se encuentran los nombre de los tramos
    Ce=["AR3","BD3","BP3","CB3","CN3","CZ3"] // Ce -> Celdas encabezado


    //----------------------------- 3.- Escribir las formulas para cada columna de la tabla de exportacion -----------------------------
    sheet.getRange(celdaEscrituraEncabezados).setFormula('TRANSPOSE(ARRAYFORMULA({"Planta";"BUSCADOR";"AÑO";"Tipo";"Indicador";"Ene";"Feb";"Mar";"Abr";"Mayo";"Jun";"Jul";"Ago";"Sept";"Oct";"Nov";"Dic";"Buscador2"}))')
    sheet.getRange(celdaEscrituraPlanta).setFormula(`ARRAYFORMULA("${nombrePlanta}"&T(SEQUENCE(COUNTA(asRangoIndicadores)*6;1)))`)
    sheet.getRange(celdaEscituraBuscador).setFormula(`ARRAYFORMULA(
        CONCAT(
                CONCAT(
                    INDIRECT("${columnaPlanta}"&ROW(${celdaEscrituraPlanta})&":${columnaPlanta}"&ROW(${celdaEscrituraPlanta})+COUNTA(asRangoIndicadores)*6);
                    INDIRECT("${columnaAño}"&ROW(${celdaEscrituraPlanta})&":${columnaAño}"&ROW(${celdaEscrituraPlanta})+COUNTA(asRangoIndicadores)*6)
                    );
                CONCAT(
                    INDIRECT("${columnaTipo}"&ROW(${celdaEscrituraPlanta})&":${columnaTipo}"&ROW(${celdaEscrituraPlanta})+COUNTA(asRangoIndicadores)*6);
                    INDIRECT("${columnaIndicador}"&ROW(${celdaEscrituraPlanta})&":${columnaIndicador}"&ROW(${celdaEscrituraPlanta})+COUNTA(asRangoIndicadores)*6)
                    )
                )
        &T(SEQUENCE(COUNTA(asRangoIndicadores)*6+1;1))
    )`)
    sheet.getRange(celdaEscrituraAño).setFormula(`
                                    ARRAYFORMULA({
                                        IF(REGEXMATCH(${Ce[0]}&T(SEQUENCE(COUNTA(asRangoIndicadores);1)); "AA"); 2021; 2022);
                                        IF(REGEXMATCH(${Ce[1]}&T(SEQUENCE(COUNTA(asRangoIndicadores);1)); "AA"); 2021; 2022);
                                        IF(REGEXMATCH(${Ce[2]}&T(SEQUENCE(COUNTA(asRangoIndicadores);1)); "AA"); 2021; 2022);
                                        IF(REGEXMATCH(${Ce[3]}&T(SEQUENCE(COUNTA(asRangoIndicadores);1)); "AA"); 2021; 2022);
                                        IF(REGEXMATCH(${Ce[4]}&T(SEQUENCE(COUNTA(asRangoIndicadores);1)); "AA"); 2021; 2022);
                                        IF(REGEXMATCH(${Ce[5]}&T(SEQUENCE(COUNTA(asRangoIndicadores);1)); "AA"); 2021; 2022) 
                                        })
                                `)
    sheet.getRange(celdaEscrituraTipo).setFormula(`
                                ARRAYFORMULA({
                                    ${Ce[0]}&T(SEQUENCE(COUNTA(asRangoIndicadores);1));
                                    ${Ce[1]}&T(SEQUENCE(COUNTA(asRangoIndicadores);1));
                                    ${Ce[2]}&T(SEQUENCE(COUNTA(asRangoIndicadores);1));
                                    ${Ce[3]}&T(SEQUENCE(COUNTA(asRangoIndicadores);1));
                                    ${Ce[4]}&T(SEQUENCE(COUNTA(asRangoIndicadores);1));
                                    ${Ce[5]}&T(SEQUENCE(COUNTA(asRangoIndicadores);1))})
                            `)
    sheet.getRange(celdaEscrituraIndicador).setFormula(`{
                                IMPORTRANGE("${URLL}";"asRangoIndicadores");
                                IMPORTRANGE("${URLL}";"asRangoIndicadores");
                                IMPORTRANGE("${URLL}";"asRangoIndicadores");
                                IMPORTRANGE("${URLL}";"asRangoIndicadores");
                                IMPORTRANGE("${URLL}";"asRangoIndicadores");
                                IMPORTRANGE("${URLL}";"asRangoIndicadores")
                            }`)
    sheet.getRange(celdaEscrituraImportRange).setFormula(`{
                                            IMPORTRANGE("${URLL}";"asRangoReal");
                                            IMPORTRANGE("${URLL}";"asRangoPPTO");
                                            IMPORTRANGE("${URLL}";"asRangoRealAA");
                                            IMPORTRANGE("${URLL}";"asRangoAcum");
                                            IMPORTRANGE("${URLL}";"asRangoAcumPPTO");
                                            IMPORTRANGE("${URLL}";"asRangoAcumAA")
                                        }`)
    sheet.getRange(celdaEscrituraBuscador2).setFormula(`ARRAYFORMULA(
        CONCAT(
                CONCAT(
                    INDIRECT("${columnaAño}"&ROW(${celdaEscrituraPlanta})&":${columnaAño}"&ROW(${celdaEscrituraPlanta})+COUNTA(asRangoIndicadores)*6);
                    INDIRECT("${columnaTipo}"&ROW(${celdaEscrituraPlanta})&":${columnaTipo}"&ROW(${celdaEscrituraPlanta})+COUNTA(asRangoIndicadores)*6)
                    );
                INDIRECT("${columnaIndicador}"&ROW(${celdaEscrituraPlanta})&":${columnaIndicador}"&ROW(${celdaEscrituraPlanta})+COUNTA(asRangoIndicadores)*6)
                )
        &T(SEQUENCE(COUNTA(asRangoIndicadores)*6+1;1))
    )`)


    //-----------------------------4.-Creamos la celda que contiene el rango dinamico export, y lo asociamos al rango con nombre Export-------------------------
    sheet.getRange(celdaEscrituraExport).setFormula(`"${nombreSheet}!${columnaExport}"&ROW(${celdaEscrituraEncabezados})&":${columnaBuscador2}"&COUNTA(asRangoIndicadores)*6+ROW(${celdaEscrituraEncabezados})`)
    libro.setNamedRange('asRangoExport', sheet.getRange(celdaEscrituraExport));
    

    //---------------------------------- 5.- Cambiar las formulas de SSMA, para que trabajen con los rangos con nombre --------------------
    //Arreglar Vlook
    FilaPrimerIndicador=5
    FilaUltimoInidicador=39
    //Columnas donde esta presente el Vlook
    ColumaAA="U"
    ColumnaPPTO="W"
    ColumnaYTD="Y"
    let RangeFormulasVlook=sheet.getRange(ColumaAA+`${FilaPrimerIndicador}`+":"+ColumnaYTD+`${FilaUltimoInidicador}`)
    let formulasVlook=RangeFormulasVlook.getFormulas()
    //Recorremos las celda, remplazando los rangos estaticos por los rangos con nombre
    for (let i=0; i<formulasVlook.length; i++){
      for (let z=0; z<formulasVlook[i].length; z++){
        formulasVlook[i][z]=formulasVlook[i][z].replaceAll("$D$244:$P$278", "{asRangoIndicadores\\asRangoAcumAA}").replaceAll("$D$174:$P$208","{asRangoIndicadores\\asRangoAcumPPTO}").replaceAll("$D$104:$P$138", "{asRangoIndicadores\\asRangoAcum}").replaceAll("$D$285:$E$296", "asRangoNumMes")
      }
    }
    RangeFormulasVlook.setFormulas(formulasVlook);


    //Arreglamos la formula del estado del mes
    let RangoEstadoMes=sheet.getRange("G49:R49")
    let formulas = RangoEstadoMes.getFormulas()[0]
    let newFormulas=[]
    for (const iterator of formulas) {newFormulas.push(iterator.replaceAll("35", "COUNTA(asRangoIndicadores)"))}
    RangoEstadoMes.setFormulas([newFormulas]);
}