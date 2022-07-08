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
    Pendientes:
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
    libro.setNamedRange('asRangoIndicadores', rangoIndicadores);
    libro.setNamedRange('asRangoReal', rangoReal);
    libro.setNamedRange('asRangoPPTO', rangoPPTO);
    libro.setNamedRange('asRangoRealAA', rangoRealAA);
    libro.setNamedRange('asRangoAcum', rangoAcum);
    libro.setNamedRange('asRangoAcumPPTO', rangoAcumPPTO);
    libro.setNamedRange('asRangoAcumAA', rangoAcumAA);
    

    //2.-Celdas en donde se agregaran las etiquetas correspondientes a los datos a importar
    let celdaEscrituraEncabezados='A9';//Donde se escribiran los encabezados
    let celdaEscrituraPlanta='A10';
    let celdaEscituraBuscador='B10';
    let celdaEscrituraAño='C10';
    let celdaEscrituraTipo='D10';
    let celdaEscrituraIndicador='E10';
    let celdaEscrituraImportRange='F10';//Donde se importaran los datos con import Range
    let celdaEscrituraBuscador2='R10';
    let celdaEscrituraExport='A8'

    //3.-Indicar las celdas donde se encuentran los nombre de los tramos
    Ce=["C3","E3","G3","I3","K3","M3"] // Ce -> Celdas encabezado

    //Abstraer las celdas para mejor comprension de las formulas
            // abstraccion = [SemiRango, Base]; Direccion real = Direccion virutal + Base
    let Planta=[`${celdaEscrituraPlanta}:${celdaEscrituraPlanta[0]}`, `${celdaEscrituraPlanta[1]+celdaEscrituraPlanta[2]}`];
    let Año=[`${celdaEscrituraAño}:${celdaEscrituraAño[0]}`, `${celdaEscrituraAño[1]+celdaEscrituraAño[2]}`];
    let Tipo=[`${celdaEscrituraTipo}:${celdaEscrituraTipo[0]}`, `${celdaEscrituraTipo[1]+celdaEscrituraTipo[2]}`];
    let Indicador=[`${celdaEscrituraIndicador}:${celdaEscrituraIndicador[0]}`, `${celdaEscrituraIndicador[1]+celdaEscrituraIndicador[2]}`];

    //Escribir las formulas para los valores dinamicos
    sheet.getRange(celdaEscrituraEncabezados).setFormula('TRANSPOSE(ARRAYFORMULA({"Planta";"BUSCADOR";"AÑO";"Tipo";"Indicador";"Ene";"Feb";"Mar";"Abr";"Mayo";"Jun";"Jul";"Ago";"Sept";"Oct";"Nov";"Dic";"Buscador2"}))')
    sheet.getRange(celdaEscrituraPlanta).setFormula(`ARRAYFORMULA("Antofagasta"&T(SEQUENCE(COUNTA(asRangoIndicadores)*6;1)))`)
    sheet.getRange(celdaEscituraBuscador).setFormula(`ARRAYFORMULA(
        CONCAT(
                CONCAT(INDIRECT("${Planta[0]}"&${Planta[1]}+COUNTA(asRangoIndicadores)*6);INDIRECT("${Año[0]}"&${Año[1]}+COUNTA(asRangoIndicadores)*6));
                CONCAT(INDIRECT("${Tipo[0]}"&${Tipo[1]}+COUNTA(asRangoIndicadores)*6);INDIRECT("${Indicador[0]}"&${Indicador[1]}+COUNTA(asRangoIndicadores)*6))
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
                CONCAT(INDIRECT("${Año[0]}"&${Año[1]}+COUNTA(asRangoIndicadores)*6);INDIRECT("${Tipo[0]}"&${Tipo[1]}+COUNTA(asRangoIndicadores)*6));
                INDIRECT("${Indicador[0]}"&${Indicador[1]}+COUNTA(asRangoIndicadores)*6))
        &T(SEQUENCE(COUNTA(asRangoIndicadores)*6+1;1))
        )`)
    sheet.getRange(celdaEscrituraExport).setFormula(`"ProbandoRangos!A10:R"&COUNTA(asRangoIndicadores)*6+10`)
    libro.setNamedRange('asRangoExport', sheet.getRange(celdaEscrituraExport));



        //
}