function test() {
    /*
    Para utilizar este script se debe modificar:
    1.-Los rango de los DATOS por periodo Tiempo ((AR5:BC39)->Real, (BP5:CA39)->RealAA, etc)
    2.-Celdas de escrituras, para generar el rango dinamico a exportar
    3.-Las celdas con el Nombre del Tramo (Ej: AR3->Real ; BD3->PPTO, etc)
    */

    //BUSCADOR: Planta/Anio/Tipo/Indicador
    //Buscador2: Anio/Tipo/Indicador

    /*
    Problemas que surgieron:
    1.-Como repetir El nombre de la planta, de tal manera que calce con las combinaciones de indicadores con tipo
    2.-Como concaternar las columnas para generar los buscadores, si no se saben el tamanio final que tendran las columnas
    3.-Las referencias de las celdas en formulas, en los buscadores, no cambian al agregar una nueva fila de indicadores.
    4.-El rango dinamico export, al agregar una fila, no se actualiza, porque no se agrega una fila en su rango, si no en el principal.
    5.-Mismo problema de referncia de celda que en (3), pero para el rango dinamico a exportar.
    1.-Arreglar buscador 1 y 2, cambiar el dinamismo del codigo, por funcion ROW(celda) de sheet.
    2.-Cambiar la escritura del rango a exportar, por ROW(celda) de sheet en el script
    Problemas de adaptacion a planilla:
    1.- Se requiere una nueva fila para el nombre de la planta
    2.-Al mover la tabla, el VlookUp del resumen del mes pierde referencia
    3.-Los indicadores al crecer hacia abajo, topara con el llave valor de los meses.
    
    
    */


    let libro = SpreadsheetApp.getActiveSpreadsheet();
    nombreSheet="Antofagasta de SSMA"
    let sheet = libro.getSheetByName(nombreSheet);
    //Eliminar los elementos y formato de la tabla de exportacion anterior.
    libro.getRange("B68:P278").clear()

    //1.-Definir los rango de los tramos de datos, para generar rangos dinamicos
    let rangoIndicadores=sheet.getRange('D5:D39')
    let rangoReal=sheet.getRange('AR5:BC39')
    let rangoPPTO=sheet.getRange('AD5:AO39')
    let rangoRealAA=sheet.getRange('BP5:CA39')
    let rangoAcum=sheet.getRange('CB5:CM39')
    let rangoAcumPPTO=sheet.getRange('CN5:CY39')
    let rangoAcumAA=sheet.getRange('CZ5:DK39')
    //let rangoExport=sheet.getRange('L10:Q21')
    libro.setNamedRange('asRangoIndicadores', rangoIndicadores);
    libro.setNamedRange('asRangoReal', rangoReal);
    libro.setNamedRange('asRangoPPTO', rangoPPTO);
    libro.setNamedRange('asRangoRealAA', rangoRealAA);
    libro.setNamedRange('asRangoAcum', rangoAcum);
    libro.setNamedRange('asRangoAcumPPTO', rangoAcumPPTO);
    libro.setNamedRange('asRangoAcumAA', rangoAcumAA);
    libro.setNamedRange('asRangoNumMes', sheet.getRange("D285:E296"));

    

    //2.-Celdas en donde se agregaran las etiquetas correspondientes a los datos a importar
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

    //3.-Indicar las celdas donde se encuentran los nombre de los tramos
    Ce=["AR3","BD3","BP3","CB3","CN3","CZ3"] // Ce -> Celdas encabezado


    //Escribir las formulas para los valores dinamicos
    sheet.getRange(celdaEscrituraEncabezados).setFormula('TRANSPOSE(ARRAYFORMULA({"Planta";"BUSCADOR";"AÑO";"Tipo";"Indicador";"Ene";"Feb";"Mar";"Abr";"Mayo";"Jun";"Jul";"Ago";"Sept";"Oct";"Nov";"Dic";"Buscador2"}))')
    sheet.getRange(celdaEscrituraPlanta).setFormula(`ARRAYFORMULA("Antofagasta"&T(SEQUENCE(COUNTA(asRangoIndicadores)*6;1)))`)
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
                                IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"asRangoIndicadores");
                                IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"asRangoIndicadores");
                                IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"asRangoIndicadores");
                                IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"asRangoIndicadores");
                                IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"asRangoIndicadores");
                                IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"asRangoIndicadores")
                            }`)
    sheet.getRange(celdaEscrituraImportRange).setFormula(`{
                                            IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"asRangoReal");
                                            IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"asRangoPPTO");
                                            IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"asRangoRealAA");
                                            IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"asRangoAcum");
                                            IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"asRangoAcumPPTO");
                                            IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"asRangoAcumAA")
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

    //Creamos la celda que contiene el rango dinamico export, y lo asociamos al rango con nombre Export
    sheet.getRange(celdaEscrituraExport).setFormula(`"${nombreSheet}!${columnaExport}"&ROW(${celdaEscrituraEncabezados})&":${columnaBuscador2}"&COUNTA(asRangoIndicadores)*6+ROW(${celdaEscrituraEncabezados})`)
    libro.setNamedRange('asRangoExport', sheet.getRange(celdaEscrituraExport));
    


    //----------------------------------Arreglar Vlook--------------------------------------
    FilaPrimerIndicador=5
    FilaUltimoInidicador=39
    //Columnas donde esta presente el Vlook
    ColumaAA="U"
    ColumnaPPTO="W"
    ColumnaYTD="Y"

    for (let index = FilaPrimerIndicador; index <= FilaUltimoInidicador; index++) {
        formulaAA=sheet.getRange(ColumaAA+`${index}`).getFormula()
        sheet.getRange(ColumaAA+`${index}`).setValue(formulaAA.replaceAll("$D$244:$P$278", "{asRangoIndicadores\\asRangoAcumAA}").replaceAll("$D$285:$E$296", "asRangoNumMes"))

        formulaPPTO=sheet.getRange(ColumnaPPTO+`${index}`).getFormula()
        sheet.getRange(ColumnaPPTO+`${index}`).setValue(formulaPPTO.replaceAll("$D$174:$P$208","{asRangoIndicadores\\asRangoAcumPPTO}").replaceAll("$D$285:$E$296", "asRangoNumMes"))  

        formulaYTD=sheet.getRange(ColumnaYTD+`${index}`).getFormula()
        sheet.getRange(ColumnaYTD+`${index}`).setValue(formulaYTD.replaceAll("$D$104:$P$138", "{asRangoIndicadores\\asRangoAcum}").replaceAll("$D$285:$E$296", "asRangoNumMes"))    
    }
}