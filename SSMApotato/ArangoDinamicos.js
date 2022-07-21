function test2() {
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
    */

    let libro = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = libro.getSheetByName("ProbandoRangos");

    //1.-Definir los rango de los tramos de datos, para generar rangos dinamicos
    let rangoIndicadores=sheet.getRange('B5:B6')
    let rangoReal=sheet.getRange('C5:D6')
    let rangoPPTO=sheet.getRange('E5:F6')
    let rangoRealAA=sheet.getRange('G5:H6')
    let rangoAcum=sheet.getRange('I5:J6')
    let rangoAcumPPTO=sheet.getRange('K5:L6')
    let rangoAcumAA=sheet.getRange('M5:N6')
    //let rangoExport=sheet.getRange('L10:Q21')
    libro.setNamedRange('as2RangoIndicadores', rangoIndicadores);
    libro.setNamedRange('as2RangoReal', rangoReal);
    libro.setNamedRange('as2RangoPPTO', rangoPPTO);
    libro.setNamedRange('as2RangoRealAA', rangoRealAA);
    libro.setNamedRange('as2RangoAcum', rangoAcum);
    libro.setNamedRange('as2RangoAcumPPTO', rangoAcumPPTO);
    libro.setNamedRange('as2RangoAcumAA', rangoAcumAA);
    

    //2.-Celdas en donde se agregaran las etiquetas correspondientes a los datos a importar
    //Abstraer las celdas en fila columna, para mejor comprension de las formulas
    let filaEscritura=10;
    let columnaEncabezado='A';
    let columnaPlanta='A'
    let columnaBuscador='B'
    let columnaAño='C'
    let columnaTipo='D'
    let columnaIndicador='E'
    let columnaImportRange='F'
    let columnaBuscador2='R'
    let columnaExport='A'
    let celdaEscrituraEncabezados=columnaEncabezado+`${filaEscritura-1}`;//A9//Donde se escribiran los encabezados
    let celdaEscrituraPlanta=columnaPlanta+`${filaEscritura}`;  //'A10';
    let celdaEscituraBuscador=columnaBuscador+`${filaEscritura}`; // 'B10';
    let celdaEscrituraAño=columnaAño+`${filaEscritura}`; //'C10';
    let celdaEscrituraTipo=columnaTipo+`${filaEscritura}`; //'D10';
    let celdaEscrituraIndicador=columnaIndicador+`${filaEscritura}`;//'E10';
    let celdaEscrituraImportRange=columnaImportRange+`${filaEscritura}`;//'F10';//Donde se importaran los datos con import Range
    let celdaEscrituraBuscador2=columnaBuscador2+`${filaEscritura}`;//'R10';
    let celdaEscrituraExport=columnaExport+`${filaEscritura-2}`;//'A8'

    //3.-Indicar las celdas donde se encuentran los nombre de los tramos
    Ce=["C3","E3","G3","I3","K3","M3"] // Ce -> Celdas encabezado


    //Escribir las formulas para los valores dinamicos
    sheet.getRange(celdaEscrituraEncabezados).setFormula('TRANSPOSE(ARRAYFORMULA({"Planta";"BUSCADOR";"AÑO";"Tipo";"Indicador";"Ene";"Feb";"Mar";"Abr";"Mayo";"Jun";"Jul";"Ago";"Sept";"Oct";"Nov";"Dic";"Buscador2"}))')
    sheet.getRange(celdaEscrituraPlanta).setFormula(`ARRAYFORMULA("Antofagasta"&T(SEQUENCE(COUNTA(as2RangoIndicadores)*6;1)))`)
    sheet.getRange(celdaEscituraBuscador).setFormula(`ARRAYFORMULA(
        CONCAT(
                CONCAT(
                    INDIRECT("${columnaPlanta}"&ROW(${celdaEscrituraPlanta})&":${columnaPlanta}"&ROW(${celdaEscrituraPlanta})+COUNTA(as2RangoIndicadores)*6);
                    INDIRECT("${columnaAño}"&ROW(${celdaEscrituraPlanta})&":${columnaAño}"&ROW(${celdaEscrituraPlanta})+COUNTA(as2RangoIndicadores)*6)
                    );
                CONCAT(
                    INDIRECT("${columnaTipo}"&ROW(${celdaEscrituraPlanta})&":${columnaTipo}"&ROW(${celdaEscrituraPlanta})+COUNTA(as2RangoIndicadores)*6);
                    INDIRECT("${columnaIndicador}"&ROW(${celdaEscrituraPlanta})&":${columnaIndicador}"&ROW(${celdaEscrituraPlanta})+COUNTA(as2RangoIndicadores)*6)
                    )
                )
        &T(SEQUENCE(COUNTA(as2RangoIndicadores)*6+1;1))
    )`)
    sheet.getRange(celdaEscrituraAño).setFormula(`
                                    ARRAYFORMULA({
                                        IF(REGEXMATCH(${Ce[0]}&T(SEQUENCE(COUNTA(as2RangoIndicadores);1)); "AA"); 2021; 2022);
                                        IF(REGEXMATCH(${Ce[1]}&T(SEQUENCE(COUNTA(as2RangoIndicadores);1)); "AA"); 2021; 2022);
                                        IF(REGEXMATCH(${Ce[2]}&T(SEQUENCE(COUNTA(as2RangoIndicadores);1)); "AA"); 2021; 2022);
                                        IF(REGEXMATCH(${Ce[3]}&T(SEQUENCE(COUNTA(as2RangoIndicadores);1)); "AA"); 2021; 2022);
                                        IF(REGEXMATCH(${Ce[4]}&T(SEQUENCE(COUNTA(as2RangoIndicadores);1)); "AA"); 2021; 2022);
                                        IF(REGEXMATCH(${Ce[5]}&T(SEQUENCE(COUNTA(as2RangoIndicadores);1)); "AA"); 2021; 2022) 
                                        })
                                `)
    sheet.getRange(celdaEscrituraTipo).setFormula(`
                                ARRAYFORMULA({
                                    ${Ce[0]}&T(SEQUENCE(COUNTA(as2RangoIndicadores);1));
                                    ${Ce[1]}&T(SEQUENCE(COUNTA(as2RangoIndicadores);1));
                                    ${Ce[2]}&T(SEQUENCE(COUNTA(as2RangoIndicadores);1));
                                    ${Ce[3]}&T(SEQUENCE(COUNTA(as2RangoIndicadores);1));
                                    ${Ce[4]}&T(SEQUENCE(COUNTA(as2RangoIndicadores);1));
                                    ${Ce[5]}&T(SEQUENCE(COUNTA(as2RangoIndicadores);1))})
                            `)
    sheet.getRange(celdaEscrituraIndicador).setFormula(`{
                                IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"as2RangoIndicadores");
                                IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"as2RangoIndicadores");
                                IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"as2RangoIndicadores");
                                IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"as2RangoIndicadores");
                                IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"as2RangoIndicadores");
                                IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"as2RangoIndicadores")
                            }`)
    sheet.getRange(celdaEscrituraImportRange).setFormula(`{
                                            IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"as2RangoReal");
                                            IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"as2RangoPPTO");
                                            IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"as2RangoRealAA");
                                            IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"as2RangoAcum");
                                            IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"as2RangoAcumPPTO");
                                            IMPORTRANGE("1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc";"as2RangoAcumAA")
                                        }`)
    sheet.getRange(celdaEscrituraBuscador2).setFormula(`ARRAYFORMULA(
        CONCAT(
                CONCAT(
                    INDIRECT("${columnaAño}"&ROW(${celdaEscrituraPlanta})&":${columnaAño}"&ROW(${celdaEscrituraPlanta})+COUNTA(as2RangoIndicadores)*6);
                    INDIRECT("${columnaTipo}"&ROW(${celdaEscrituraPlanta})&":${columnaTipo}"&ROW(${celdaEscrituraPlanta})+COUNTA(as2RangoIndicadores)*6)
                    );
                INDIRECT("${columnaIndicador}"&ROW(${celdaEscrituraPlanta})&":${columnaIndicador}"&ROW(${celdaEscrituraPlanta})+COUNTA(as2RangoIndicadores)*6)
                )
        &T(SEQUENCE(COUNTA(as2RangoIndicadores)*6+1;1))
    )`)
    sheet.getRange(celdaEscrituraExport).setFormula(`"ProbandoRangos!${columnaExport}"&ROW(${celdaEscrituraEncabezados})&":${columnaBuscador2}"&COUNTA(as2RangoIndicadores)*6+ROW(${celdaEscrituraEncabezados})`)
    libro.setNamedRange('as2RangoExport', sheet.getRange(celdaEscrituraExport));



        //
}