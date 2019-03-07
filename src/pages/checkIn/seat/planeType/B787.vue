<template lang="html">
    <div class="seat-content-wp">
        <div class="seat-title">
            <div class="seat-title-group">
                <div class="item">A</div>
                <div class="item">B</div>
                <div class="item">C</div>
            </div>
            <div class="seat-title-null"></div>
            <div class="seat-title-group">
                <div class="item">D</div>
                <div class="item">E</div>
                <div class="item">G</div>
            </div>
            <div class="seat-title-null"></div>
            <div class="seat-title-group">
                <div class="item">H</div>
                <div class="item">J</div>
                <div class="item">K</div>
            </div>
        </div>
        <!-- <div class="seat-content">
            <div class="seat-row" v-for="(item, index) in 35">
                <div class="seat-group">
                    <div :id="'A' + (index + 10)" class="seat-no">
                    </div>
                    <div :id="'B' + (index + 10)" class="seat-no">
                    </div>
                    <div :id="'C' + (index + 10)" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    {{(index + 10)}}
                </div>
                <div class="seat-group">
                    <div :id="'D' + (index + 10)" class="seat-no">
                    </div>
                    <div :id="'E' + (index + 10)" class="seat-no">
                    </div>
                    <div :id="'G' + (index + 10)" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    {{(index + 10)}}
                </div>
                <div class="seat-group">
                    <div :id="'H' + (index + 10)" class="seat-no">
                    </div>
                    <div :id="'J' + (index + 10)" class="seat-no">
                    </div>
                    <div :id="'K' + (index + 10)" class="seat-no">
                    </div>
                </div>
            </div>
            
            <div class="seat-row exit">
                <div class="flight-exit left">
                </div>
                <div class="exit-text">
                    EXIT
                </div>
                <div class="flight-exit right">
                </div>
            </div>
        </div> -->
        <div class="seat-content">
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A10" class="seat-no">
                    </div>
                    <div id="B10" class="seat-no">
                    </div>
                    <div id="C10" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    10
                </div>
                <div class="seat-group">
                    <div class="empty">
                    </div>
                    <div class="seat-baby">
                    </div>
                    <div class="empty">
                    </div>
                </div>
                <div class="seat-aisle">
                    10
                </div>
                <div class="seat-group">
                    <div id="H10" class="seat-no">
                    </div>
                    <div id="J10" class="seat-no">
                    </div>
                    <div id="K10" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A11" class="seat-no">
                    </div>
                    <div id="B11" class="seat-no">
                    </div>
                    <div id="C11" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    11
                </div>
                <div class="seat-group">
                    <div id="D11" class="seat-no">
                    </div>
                    <div id="E11" class="seat-no">
                    </div>
                    <div id="G11" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    11
                </div>
                <div class="seat-group">
                    <div id="H11" class="seat-no">
                    </div>
                    <div id="J11" class="seat-no">
                    </div>
                    <div id="K11" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A12" class="seat-no">
                    </div>
                    <div id="B12" class="seat-no">
                    </div>
                    <div id="C12" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    12
                </div>
                <div class="seat-group">
                    <div id="D12" class="seat-no">
                    </div>
                    <div id="E12" class="seat-no">
                    </div>
                    <div id="G12" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    12
                </div>
                <div class="seat-group">
                    <div id="H12" class="seat-no">
                    </div>
                    <div id="J12" class="seat-no">
                    </div>
                    <div id="K12" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A13" class="seat-no">
                    </div>
                    <div id="B13" class="seat-no">
                    </div>
                    <div id="C13" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    13
                </div>
                <div class="seat-group">
                    <div id="D13" class="seat-no">
                    </div>
                    <div id="E13" class="seat-no">
                    </div>
                    <div id="G13" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    13
                </div>
                <div class="seat-group">
                    <div id="H13" class="seat-no">
                    </div>
                    <div id="J13" class="seat-no">
                    </div>
                    <div id="K13" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A14" class="seat-no">
                    </div>
                    <div id="B14" class="seat-no">
                    </div>
                    <div id="C14" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    14
                </div>
                <div class="seat-group">
                    <div id="D14" class="seat-no">
                    </div>
                    <div id="E14" class="seat-no">
                    </div>
                    <div id="G14" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    14
                </div>
                <div class="seat-group">
                    <div id="H14" class="seat-no">
                    </div>
                    <div id="J14" class="seat-no">
                    </div>
                    <div id="K14" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A15" class="seat-no">
                    </div>
                    <div id="B15" class="seat-no">
                    </div>
                    <div id="C15" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    15
                </div>
                <div class="seat-group">
                    <div id="D15" class="seat-no">
                    </div>
                    <div id="E15" class="seat-no">
                    </div>
                    <div id="G15" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    15
                </div>
                <div class="seat-group">
                    <div id="H15" class="seat-no">
                    </div>
                    <div id="J15" class="seat-no">
                    </div>
                    <div id="K15" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A16" class="seat-no">
                    </div>
                    <div id="B16" class="seat-no">
                    </div>
                    <div id="C16" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    16
                </div>
                <div class="seat-group">
                    <div id="D16" class="seat-no">
                    </div>
                    <div id="E16" class="seat-no">
                    </div>
                    <div id="G16" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    16
                </div>
                <div class="seat-group">
                    <div id="H16" class="seat-no">
                    </div>
                    <div id="J16" class="seat-no">
                    </div>
                    <div id="K16" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A17" class="seat-no">
                    </div>
                    <div id="B17" class="seat-no">
                    </div>
                    <div id="C17" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    17
                </div>
                <div class="seat-group">
                    <div id="D17" class="seat-no">
                    </div>
                    <div id="E17" class="seat-no">
                    </div>
                    <div id="G17" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    17
                </div>
                <div class="seat-group">
                    <div id="H17" class="seat-no">
                    </div>
                    <div id="J17" class="seat-no">
                    </div>
                    <div id="K17" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A18" class="seat-no">
                    </div>
                    <div id="B18" class="seat-no">
                    </div>
                    <div id="C18" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    18
                </div>
                <div class="seat-group">
                    <div id="D18" class="seat-no">
                    </div>
                    <div id="E18" class="seat-no">
                    </div>
                    <div id="G18" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    18
                </div>
                <div class="seat-group">
                    <div id="H18" class="seat-no">
                    </div>
                    <div id="J18" class="seat-no">
                    </div>
                    <div id="K18" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A19" class="seat-no">
                    </div>
                    <div id="B19" class="seat-no">
                    </div>
                    <div id="C19" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    19
                </div>
                <div class="seat-group">
                    <div id="D19" class="seat-no">
                    </div>
                    <div id="E19" class="seat-no">
                    </div>
                    <div id="G19" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    19
                </div>
                <div class="seat-group">
                    <div id="H19" class="seat-no">
                    </div>
                    <div id="J19" class="seat-no">
                    </div>
                    <div id="K19" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A20" class="seat-no">
                    </div>
                    <div id="B20" class="seat-no">
                    </div>
                    <div id="C20" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    20
                </div>
                <div class="seat-group">
                    <div id="D20" class="seat-no">
                    </div>
                    <div id="E20" class="seat-no">
                    </div>
                    <div id="G20" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    20
                </div>
                <div class="seat-group">
                    <div id="H20" class="seat-no">
                    </div>
                    <div id="J20" class="seat-no">
                    </div>
                    <div id="K20" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A21" class="seat-no">
                    </div>
                    <div id="B21" class="seat-no">
                    </div>
                    <div id="C21" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    21
                </div>
                <div class="seat-group">
                    <div id="D21" class="seat-no">
                    </div>
                    <div id="E21" class="seat-no">
                    </div>
                    <div id="G21" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    21
                </div>
                <div class="seat-group">
                    <div id="H21" class="seat-no">
                    </div>
                    <div id="J21" class="seat-no">
                    </div>
                    <div id="K21" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A22" class="seat-no">
                    </div>
                    <div id="B22" class="seat-no">
                    </div>
                    <div id="C22" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    22
                </div>
                <div class="seat-group">
                    <div id="D22" class="seat-no">
                    </div>
                    <div id="E22" class="seat-no">
                    </div>
                    <div id="G22" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    22
                </div>
                <div class="seat-group">
                    <div id="H22" class="seat-no">
                    </div>
                    <div id="J22" class="seat-no">
                    </div>
                    <div id="K22" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A23" class="seat-no">
                    </div>
                    <div id="B23" class="seat-no">
                    </div>
                    <div id="C23" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    23
                </div>
                <div class="seat-group">
                    <div id="D23" class="seat-no">
                    </div>
                    <div id="E23" class="seat-no">
                    </div>
                    <div id="G23" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    23
                </div>
                <div class="seat-group">
                    <div id="H23" class="seat-no">
                    </div>
                    <div id="J23" class="seat-no">
                    </div>
                    <div id="K23" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A24" class="seat-no">
                    </div>
                    <div id="B24" class="seat-no">
                    </div>
                    <div id="C24" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    24
                </div>
                <div class="seat-group">
                    <div id="D24" class="seat-no">
                    </div>
                    <div id="E24" class="seat-no">
                    </div>
                    <div id="G24" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    24
                </div>
                <div class="seat-group">
                    <div id="H24" class="seat-no">
                    </div>
                    <div id="J24" class="seat-no">
                    </div>
                    <div id="K24" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A25" class="seat-no">
                    </div>
                    <div id="B25" class="seat-no">
                    </div>
                    <div id="C25" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    25
                </div>
                <div class="seat-group">
                    <div id="D25" class="seat-no">
                    </div>
                    <div id="E25" class="seat-no">
                    </div>
                    <div id="G25" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    25
                </div>
                <div class="seat-group">
                    <div id="H25" class="seat-no">
                    </div>
                    <div id="J25" class="seat-no">
                    </div>
                    <div id="K25" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A26" class="seat-no">
                    </div>
                    <div id="B26" class="seat-no">
                    </div>
                    <div id="C26" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    26
                </div>
                <div class="seat-group">
                    <div id="D26" class="seat-no">
                    </div>
                    <div id="E26" class="seat-no">
                    </div>
                    <div id="G26" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    26
                </div>
                <div class="seat-group">
                    <div id="H26" class="seat-no">
                    </div>
                    <div id="J26" class="seat-no">
                    </div>
                    <div id="K26" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A27" class="seat-no">
                    </div>
                    <div id="B27" class="seat-no">
                    </div>
                    <div id="C27" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    27
                </div>
                <div class="seat-group">
                    <div id="D27" class="seat-no">
                    </div>
                    <div id="E27" class="seat-no">
                    </div>
                    <div id="G27" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    27
                </div>
                <div class="seat-group">
                    <div id="H27" class="seat-no">
                    </div>
                    <div id="J27" class="seat-no">
                    </div>
                    <div id="K27" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A28" class="seat-no">
                    </div>
                    <div id="B28" class="seat-no">
                    </div>
                    <div id="C28" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    28
                </div>
                <div class="seat-group">
                    <div class="toilet toilet-2">
                    </div>
                    <div class="toilet toilet-2">
                    </div>
                </div>
                <div class="seat-aisle">
                    28
                </div>
                <div class="seat-group">
                    <div id="H28" class="seat-no">
                    </div>
                    <div id="J28" class="seat-no">
                    </div>
                    <div id="K28" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row exit">
                <div class="flight-exit left">
                </div>
                <div class="exit-text">
                    EXIT
                </div>
                <div class="flight-exit right">
                </div>
            </div>
            <div class="seat-row mt0">
                <div class="seat-group">
                    <div class="empty">
                    </div>
                    <div class="empty">
                    </div>
                    <div class="empty">
                    </div>
                </div>
                <div class="seat-aisle"></div>
                <div class="seat-group">
                    <div class="seat-baby">
                    </div>
                    <div class="empty">
                    </div>
                    <div class="empty">
                    </div>
                </div>
                <div class="seat-aisle"></div>
                <div class="seat-group">
                    <div class="empty">
                    </div>
                    <div class="empty">
                    </div>
                    <div class="empty">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div class="empty">
                    </div>
                    <div class="empty">
                    </div>
                    <div class="empty">
                    </div>
                </div>
                <div class="seat-aisle">
                    29
                </div>
                <div class="seat-group">
                    <div id="D29" class="seat-no">
                    </div>
                    <div id="E29" class="seat-no">
                    </div>
                    <div id="G29" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    29
                </div>
                <div class="seat-group">
                    <div class="empty">
                    </div>
                    <div class="empty">
                    </div>
                    <div class="empty">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A30" class="seat-no">
                    </div>
                    <div id="B30" class="seat-no">
                    </div>
                    <div id="C30" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    30
                </div>
                <div class="seat-group">
                    <div id="D30" class="seat-no">
                    </div>
                    <div id="E30" class="seat-no">
                    </div>
                    <div id="G30" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    30
                </div>
                <div class="seat-group">
                    <div id="H30" class="seat-no">
                    </div>
                    <div id="J30" class="seat-no">
                    </div>
                    <div id="K30" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A31" class="seat-no">
                    </div>
                    <div id="B31" class="seat-no">
                    </div>
                    <div id="C31" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    31
                </div>
                <div class="seat-group">
                    <div id="D31" class="seat-no">
                    </div>
                    <div id="E31" class="seat-no">
                    </div>
                    <div id="G31" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    31
                </div>
                <div class="seat-group">
                    <div id="H31" class="seat-no">
                    </div>
                    <div id="J31" class="seat-no">
                    </div>
                    <div id="K31" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A32" class="seat-no">
                    </div>
                    <div id="B32" class="seat-no">
                    </div>
                    <div id="C32" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    32
                </div>
                <div class="seat-group">
                    <div id="D32" class="seat-no">
                    </div>
                    <div id="E32" class="seat-no">
                    </div>
                    <div id="G32" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    32
                </div>
                <div class="seat-group">
                    <div id="H32" class="seat-no">
                    </div>
                    <div id="J32" class="seat-no">
                    </div>
                    <div id="K32" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A33" class="seat-no">
                    </div>
                    <div id="B33" class="seat-no">
                    </div>
                    <div id="C33" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    33
                </div>
                <div class="seat-group">
                    <div id="D33" class="seat-no">
                    </div>
                    <div id="E33" class="seat-no">
                    </div>
                    <div id="G33" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    33
                </div>
                <div class="seat-group">
                    <div id="H33" class="seat-no">
                    </div>
                    <div id="J33" class="seat-no">
                    </div>
                    <div id="K33" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A34" class="seat-no">
                    </div>
                    <div id="B34" class="seat-no">
                    </div>
                    <div id="C34" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    34
                </div>
                <div class="seat-group">
                    <div id="D34" class="seat-no">
                    </div>
                    <div id="E34" class="seat-no">
                    </div>
                    <div id="G34" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    34
                </div>
                <div class="seat-group">
                    <div id="H34" class="seat-no">
                    </div>
                    <div id="J34" class="seat-no">
                    </div>
                    <div id="K34" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A35" class="seat-no">
                    </div>
                    <div id="B35" class="seat-no">
                    </div>
                    <div id="C35" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    35
                </div>
                <div class="seat-group">
                    <div id="D35" class="seat-no">
                    </div>
                    <div id="E35" class="seat-no">
                    </div>
                    <div id="G35" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    35
                </div>
                <div class="seat-group">
                    <div id="H35" class="seat-no">
                    </div>
                    <div id="J35" class="seat-no">
                    </div>
                    <div id="K35" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A36" class="seat-no">
                    </div>
                    <div id="B36" class="seat-no">
                    </div>
                    <div id="C36" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    36
                </div>
                <div class="seat-group">
                    <div id="D36" class="seat-no">
                    </div>
                    <div id="E36" class="seat-no">
                    </div>
                    <div id="G36" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    36
                </div>
                <div class="seat-group">
                    <div id="H36" class="seat-no">
                    </div>
                    <div id="J36" class="seat-no">
                    </div>
                    <div id="K36" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A37" class="seat-no">
                    </div>
                    <div id="B37" class="seat-no">
                    </div>
                    <div id="C37" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    37
                </div>
                <div class="seat-group">
                    <div id="D37" class="seat-no">
                    </div>
                    <div id="E37" class="seat-no">
                    </div>
                    <div id="G37" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    37
                </div>
                <div class="seat-group">
                    <div id="H37" class="seat-no">
                    </div>
                    <div id="J37" class="seat-no">
                    </div>
                    <div id="K37" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A38" class="seat-no">
                    </div>
                    <div id="B38" class="seat-no">
                    </div>
                    <div id="C38" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    38
                </div>
                <div class="seat-group">
                    <div id="D38" class="seat-no">
                    </div>
                    <div id="E38" class="seat-no">
                    </div>
                    <div id="G38" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    38
                </div>
                <div class="seat-group">
                    <div id="H38" class="seat-no">
                    </div>
                    <div id="J38" class="seat-no">
                    </div>
                    <div id="K38" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A39" class="seat-no">
                    </div>
                    <div id="B39" class="seat-no">
                    </div>
                    <div id="C39" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    39
                </div>
                <div class="seat-group">
                    <div id="D39" class="seat-no">
                    </div>
                    <div id="E39" class="seat-no">
                    </div>
                    <div id="G39" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    39
                </div>
                <div class="seat-group">
                    <div id="H39" class="seat-no">
                    </div>
                    <div id="J39" class="seat-no">
                    </div>
                    <div id="K39" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A40" class="seat-no">
                    </div>
                    <div id="B40" class="seat-no">
                    </div>
                    <div id="C40" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    40
                </div>
                <div class="seat-group">
                    <div id="D40" class="seat-no">
                    </div>
                    <div id="E40" class="seat-no">
                    </div>
                    <div id="G40" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    40
                </div>
                <div class="seat-group">
                    <div id="H40" class="seat-no">
                    </div>
                    <div id="J40" class="seat-no">
                    </div>
                    <div id="K40" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A41" class="seat-no">
                    </div>
                    <div id="B41" class="seat-no">
                    </div>
                    <div id="C41" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    41
                </div>
                <div class="seat-group">
                    <div id="D41" class="seat-no">
                    </div>
                    <div id="E41" class="seat-no">
                    </div>
                    <div id="G41" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    41
                </div>
                <div class="seat-group">
                    <div id="H41" class="seat-no">
                    </div>
                    <div id="J41" class="seat-no">
                    </div>
                    <div id="K41" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div id="A42" class="seat-no">
                    </div>
                    <div id="B42" class="seat-no">
                    </div>
                    <div id="C42" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    42
                </div>
                <div class="seat-group">
                    <div id="D42" class="seat-no">
                    </div>
                    <div id="E42" class="seat-no">
                    </div>
                    <div id="G42" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    42
                </div>
                <div class="seat-group">
                    <div id="H42" class="seat-no">
                    </div>
                    <div id="J42" class="seat-no">
                    </div>
                    <div id="K42" class="seat-no">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div class="empty">
                    </div>
                    <div id="B43" class="seat-no">
                    </div>
                    <div id="C43" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    43
                </div>
                <div class="seat-group">
                    <div id="D43" class="seat-no">
                    </div>
                    <div id="E43" class="seat-no">
                    </div>
                    <div id="G43" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    43
                </div>
                <div class="seat-group">
                    <div id="H43" class="seat-no">
                    </div>
                    <div id="J43" class="seat-no">
                    </div>
                    <div class="empty">
                    </div>
                </div>
            </div>
            <div class="seat-row">
                <div class="seat-group">
                    <div class="empty">
                    </div>
                    <div class="toilet">
                    </div>
                </div>
                <div class="seat-aisle">
                    44
                </div>
                <div class="seat-group">
                    <div id="D44" class="seat-no">
                    </div>
                    <div id="E44" class="seat-no">
                    </div>
                    <div id="G44" class="seat-no">
                    </div>
                </div>
                <div class="seat-aisle">
                    44
                </div>
                <div class="seat-group">
                    <div class="toilet">
                    </div>
                    <div class="empty">
                    </div>
                </div>
            </div>
            <div class="seat-row exit">
                <div class="flight-exit left">
                </div>
                <div class="exit-text">
                    EXIT
                </div>
                <div class="flight-exit right">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {

}
</script>
