#!/usr/bin/node
import * as UDP from "dgram";
import https from "https";

const server = UDP.createSocket("udp4");

const port = 2222;

server.on("listening", () => {
  const address = server.address();
  console.log(
    "Listening on",
    "Address:",
    address.address,
    "Port:",
    address.port
  );
});

server.on("message", async (packet, info) => {
  // Parse DNS packet
  const ID = packet.readUInt16BE(0);
  const flags = packet.readUInt16BE(2).toString(2).padStart(16, "0");
  const qdCount = packet.readUInt16BE(4);
  const anCount = packet.readUInt16BE(6);
  const authority = packet.readUInt16BE(8);
  const additionals = packet.readUInt16BE(10);
  const domainName = parseDomainName(packet, 12);
  const endOfDomainName = 13 + domainName.length;
  const questionType = packet.readUInt16BE(endOfDomainName + 1);
  const questionClass = packet.readUInt16BE(endOfDomainName + 3);

  // Log DNS packet information
  console.log(
    `Headers - id: ${ID}, flags: ${flags}, questions: ${qdCount}, answers: ${anCount}, authority: ${authority}, additionals: ${additionals}`
  );

  if (qdCount > 0) {
    console.log(
      `Questions - name: ${domainName}, type: ${questionType}, class: ${questionClass}`
    );
  } else {
    console.log("Questions - empty");
  }

  // Make DNS-over-HTTPS request to Google DNS
  const responseDNS = await new Promise((resolve, reject) => {
    https.get(
      `https://dns.google/resolve?name=${domainName}&class=${questionClass}&ct=application/dns-message`,
      (res) => {
        res.on("data", (data) => {
          resolve(data);
        });
      }
    );
  });

  // Write DNS ID back to the response
  const responseBuffer = Buffer.from(responseDNS);
  responseBuffer.writeUInt16BE(ID, 0);

  // Sending back the response to the client
  server.send(responseBuffer, info.port, info.address, (err) => {
    if (err) {
      console.error("Failed to send response!!");
    } else {
      console.log("Response sent successfully");
    }
  });
});

server.bind(port);

// Parse domain name from DNS packet
function parseDomainName(packet, offset) {
  let domainName = "";
  let index = offset;
  while (packet[index] !== 0) {
    const labelLength = packet[index];
    domainName +=
      packet.toString("utf-8", index + 1, index + 1 + labelLength) + ".";
    index += labelLength + 1;
  }
  domainName = domainName.slice(0, -1); // Remove the trailing dot
  return domainName;
}
