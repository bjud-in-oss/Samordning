import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { StreamFilterStatus } from "../StreamFilterStatus";

describe("StreamFilterStatus", () => {
  it("renders correct copy when push notifications are turned OFF and hides AVISERINGAR AV tag", () => {
    const html = renderToString(
      <StreamFilterStatus savedTags={null} pushEnabled={false} />
    );
    expect(html).toContain("Välj att ta emot inbjudningar");
    expect(html).toContain(
      "Du ser direkt när någon behöver ditt stöd. Du är helt anonym och ingen kan se dina val eller begränsningar. Du kan när som helst välja var du vill vara tillgänglig."
    );
    expect(html).not.toContain("AVISERINGAR AV");
  });

  it("renders standard parish area copy when push is ON and no custom area is limited", () => {
    const html = renderToString(
      <StreamFilterStatus savedTags={{ limitAreas: false }} pushEnabled={true} />
    );
    expect(html).toContain("Begränsa din tillgänglighet");
    expect(html).toContain("Tillgänglig i hela församlingens område");
    expect(html).toContain(
      "Du tar emot inbjudningar från hela församlingsområdet. Klicka på kortet eller kugghjulet om du vill snäva av dina platser."
    );
  });

  it("renders customized areas copy and chips when push is ON and limited areas are selected", () => {
    const html = renderToString(
      <StreamFilterStatus
        savedTags={{
          limitAreas: true,
          limitedAreas: ["Majorna", "Linné"]
        }}
        pushEnabled={true}
      />
    );
    expect(html).toContain("Anpassat urval");
    expect(html).toContain("Dina valda områden");
    expect(html).toContain("Du tar emot inbjudningar för dina valda platser i församlingsområdet.");
    expect(html).toContain("Majorna");
    expect(html).toContain("Linné");
  });
});
