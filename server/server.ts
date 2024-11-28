import * as http from "http";
import app from "./routes";
import WebSocket from "ws";
import Engine from "./engine/engine";

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const engine = new Engine();

engine.run();
wss.on("connection", engine.newPlayerSocket());
server.listen(3001, () => console.log("WebSocket server running on port 3001"));

// MAYHEM: Make the rest of the project us ts

console.log(`
ÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆNÕn¿¿oÕÆÕn2NÆÆÆÆNÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆ
ÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆNZnëÕ¦¿¿NÆÕ¦¿no ¿ nZZÆÆ¿ ¿n¿ëÕë¦NNÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆNÆ
NÆNÆNÆNÆNÆNÆNÆNÆNÆN  ¦NÆÆNo¿n>¦¦ nÆÆNn ÕÆÆÆÆeZNÆÆNÆÆÕZe on  NÆNÆNÆNÆNÆNÆNÆNÆNÆÆÆ
ÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÕ >ZÕ¦o n >ÆNÆÆNn    ¦eN2¿>o >o> ¦>¦>o¿   o ¦NÕn2ÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆ
ÆÆÆÆÆÆÆÆÆÆNÕ¿¦ ëo¦No¦¿n   Zëe ¿ÆÆÆÕ2o ¿  ë2N>ëÆÆÆNeZ> o¦¿  ëÆ2 >>N2¿NÆÆÆÆÆÆÆNÆNÆ
NÆNÆNÆNÆNÕZ o¿Z> NNë¿oNNN¦   nNÆNÆNeNÆÆÆNÆÆÆÆÆÆNÆÆÆÆÆZ ¿NÕÕ2¿e> > 2o¿nëNÆNÆÆÆÆÆÆ
ÆÆÆÆÆÆÆN > 2No >N  ZNÆÆÆ  ZÕÆNNÆÆnnoo ZÆÆÆÆNÆN2ZNoZNÆÆ¿ n¿NZZ   ZÆÆNe¿>ëÆÆÆNÆÆÆÆ
ÆÆÆÆÆNN2 ¦ N  n¿N  ¦¿ZNn¿>n2NZ¦>ëÕÆÆNÕeëNZNN2Õ2ÕNNNN>No Õ22enN  >Õo¦¿n ¦ëÆNÆÆNÆN
ÆNÆNo¦¦oZ¦ ¦¿ÆÆN e¦ZnNNe¦Õ¦ ¦¿e  o¿ëÕ ¦ee¿ÕN¿ë¦¿   >    ¦ ë¿o2ÆNN¿no¿  >>ëë¿NÆÆÆ
ÆÆN¿ ÕÆëNN NÆë>ëe   >ooë¦  e2ëoëZ¿    2Z> >¦     2n2ëo¦¿Z2 ¦e>Õnnë2n¦Õ  n ¿>ëÆÆÆ
N¦¦>> >o>>¦ Õ222>  >Zë ¿Z¦  >Õë¦>e>      >       >¿   oenë >eo  n¿NZ>>>¿Nëë¿  eÆ
¿ ¦N¿>  ëe¦ n     oÆNÕo e2>                            nn o      noo> ÕN ¿¿¿ën Õ
Z ÕNnNN¦ ¦ëN>   oNÆNn >                                       ¿e>2¦n>>ÕnoÆn   oÕ
ë >¿    Õ>NÆÆ2 Õo o                                           o>     >¿ ¿ëÆo oZ>
 ¿ÆNn¿  ë>ee¿o ëo                ¿ ¦   ¿ Z  e   ¿         ¦      2 >¦  2>>¦¦   ë
¿2eÕ¿ÕZno> ¦¦ >n                  e   Æ2 N >n>    ¦¿¿   n¦          ¦  on¦o2o>ÕÆ
Æë>    ¦o>>                >     ¦ ZÕnëZeÆÆ22ë Z                     ¦  >¿   nNÆ
ÆÆÆo¦ >                          ¦ëoZNÆÆÆNÆZÆN N                    n     >2NÆÆÆ
NÆÆÆÆNNn2N2            ¦>         Z¿ZNëÆNÆÆÆÆÆÆ        ¦   ¦>   >  >nNÆNÆÆÆÆÆÆNÆ
ÆÆNÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆNÆÆNÆÆÆNÕÆNÆÆÆÆ¿  ëNnÆÆÆÆNÆNn2>ÆÆÆNÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆNÆNÆNÆÆÆ
NÆÆÆNÆNÆNÆNÆÆÆÆNÆÆÆÆÆÆÆNÆÆÆÆÆÆÆÆÆN  oNÕZÕÕNoN¿¦ ZÆNÆÆÆNÆÆNÆNÆÆÆÆÆÆÆÆÆNÆÆÆÆÆÆÆÆNÆ
ÆÆNÆÆÆÆÆÆÆÆÆNÆÆÆÆNÆNÆNÆÆÆÆÆNÆNeeoZn nÆZÕëNNnnZeoÕZ2ZÕNÆÆÆÆÆÆÆNÆNÆNÆNÆÆÆNÆÆÆÆNÆÆÆ
NÆÆÆÆÆÆÆÆÆNÆÆÆNÆÆÆÆÆÆÆÆNN¿Õe>2 Zeoo¿oe¿N2  nZoeë¦2NNZZ¦nÕ2ÆNÆÆÆÆÆÆÆÆÆNÆÆÆNÆÆÆÆNÆ
ÆÆNÆNÆNÆNÆÆÆNÆÆÆNÆÆÆÆNNoo¿ ¿2>                      >o ¦  2NÆÆÆÆÆÆÆNÆÆÆNÆÆÆNÆÆÆÆ
NÆÆÆÆÆÆÆÆÆNÆÆÆNÆÆÆNÆÆÆe¦          >     >2 o    > ¦  >>n>   NÆNÆNÆÆÆÆNÆÆÆNÆÆÆNÆÆ
ÆÆÆÆÆÆÆÆNÆÆÆNÆÆÆNÆÆÆNÆÆNnn2>       >    2ë 2n             oÕÆÆÆÆÆÆNÆÆÆÆNÆÆÆNÆÆÆN
ÆNÆNÆNÆÆÆÆNÆÆÆNÆÆÆNÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÕ oZ¦neN2NZë  NÆNNÆÆÆÆÆÆÆÆNÆÆÆNÆÆÆNÆÆÆÆNÆÆÆNÆÆ
ÆÆÆÆÆÆÆNÆÆÆÆNÆÆÆNÆÆÆNÆNÆÆNÆNÆÆÆÆÆÆN  ÕeÕZÕ>NëÕo NÆÆÆÆNÆÆÆNÆÆÆÆNÆÆÆNÆÆÆNÆÆÆÆNÆÆÆÆ
ÆÆÆÆÆNÆÆÆNÆÆÆÆNÆÆÆNÆÆÆÆÆÆÆÆÆÆNÆNÆN>  NëÆÕÆNÆÕÕ  NNÆNÆÆÆNÆÆÆNÆÆÆÆNÆÆÆNÆÆÆNÆÆÆÆNÆN
ÆNÆNÆÆÆNÆÆÆNÆÆÆÆNÆÆÆÆÆNÆNÆÆNÆÆÆÆÆëN ¦n2NZNÕNÕNn ÕNÆÆÆNÆÆÆNÆÆÆNÆÆÆÆNÆÆÆNÆÆÆNÆÆÆÆÆ
ÆÆÆÆÆNÆÆÆNÆÆÆNÆÆÆÆNÆNÆÆÆÆÆÆÆÆÆÆNN¦Z ¦o¦NNooZ¦ë2 ëZNÆÆÆÆNÆÆÆNÆÆÆNÆÆÆÆNÆÆÆNÆÆÆNÆÆÆ
ÆÆÆNÆÆÆNÆÆÆNÆÆÆNÆÆÆÆÆÆÆÆNÆNÆNÆÆN  ë    22   e2  2Z ÕÆNÆÆÆNÆÆÆNÆÆÆNÆÆÆÆNÆÆÆNÆÆÆNÆ
NÆÆÆÆNÆÆÆNÆÆÆNÆÆÆNÆÆNÆNÆÆÆÆÆÆÆÆÕ o¿         n¿  ¿Æn¿ÆÆÆNÆÆÆNÆÆÆNÆÆÆNÆÆÆÆNÆÆÆNÆÆÆ
ÆÆNÆÆÆÆNÆÆÆNÆÆÆNÆÆÆÆÆÆÆÆÆÆÆÆNëo> ¿      ¦ N   >  N>ë¿ëNÆÆNÆÆÆNÆÆÆNÆÆÆNÆÆÆÆNÆÆÆÆÆ
NÆÆÆNÆÆÆÆNÆÆÆNÆÆÆNÆNÆÆNÆNÆNÕen¦nZ  >n2    e   ¦o ¿onZ¦¿ZeÆÆNÆÆÆNÆÆÆNÆÆÆNÆÆÆÆNÆNÆ
ÆÆNÆÆÆNÆÆÆÆNÆÆÆNÆÆÆÆÆÆÆÆNeZn22e¿¦ >oe¿    e>  ¦2> Õ¦ ë> ZnZÆÆNÆÆÆNÆÆÆNÆÆÆNÆÆÆÆÆÆ
NÆÆÆNÆÆÆNÆÆÆÆNÆÆÆÆÆNN o ¿ ¿> 2¿22o¦  e¿¦¦¦¦>  ¦Z¿> o>   eee¦NÆÆNÆÆÆNÆÆÆNÆÆÆNÆÆNÆ
ÆÆNÆÆÆNÆÆÆNÆÆÆÆNÆÕ¦¿ 2   >o      >¦ne>nÕ Õë>ZN ë  o         > ZÆÆNÆÆÆNÆÆÆNÆÆÆÆÆÆ
NÆÆÆNÆÆÆNÆÆÆNÆ2¦Zn¿   ¦  ¿ë¿ën  ¿    n    o  n   2ÕÕëe¦ ¿       ¦nÆNÆÆÆNÆÆÆNÆNÆÆ
ÆÆNÆÆÆNÆÆÆNn       ¦ëZ2¦n   ë2ëNo2nÕnëN>oN>nÕ oo  n¦ NNe >>   ¿ ¦no> oÆÆÆNÆÆÆÆÆN
ÆÆÆÆNÆÆÆN22> ¿ ¿NÕëeZ¿ZZÕeo >ë ÕNÕ¦¦eZnNn2eNÕNNNoÕÕZëZNÕëNNëÕÕëÕ>¿Z¦  >eÆÆÆÆÆNÆÆ
ÆNÆÆÆÆNÆNÕZeÕëëÆ22ë2e ¿ 2oeë   ¦e noë n¿¿e >ë ¦n¿>Zo Õoeë  n oÕe>2ë¦ 2ÕZeNÆNÆÆÆN
    `);