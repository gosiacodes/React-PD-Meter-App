import React, { Fragment } from "react";

const Info = () => {
  // DOM elements with text which shows when instructions are needed
  return (
    <Fragment>
      <div className="content">
        <p>Bäst resultat kan uppnås när ansiktet är ca 40 cm från kameran.</p>
        <p>Se till att det är bra ljus och att kameran är ren.</p>
        <p>Sitt stilla och rör inte på huvudet.</p>
        <p>
          Titta rakt in i kameran eller på den röda prickan överst och ta en
          bild.
        </p>
        <p>
          Resultatet till vänster är det ungefärliga avståndet mellan pupiller.
        </p>
        <p>Resultatet till höger är PD-medelvärdet om du tar flera bilder.</p>
        <p>
          Du kan ta om bilden så många gånger du vill (vänta tills videon laddas
          igen).
        </p>
      </div>
    </Fragment>
  );
};

export default Info;
