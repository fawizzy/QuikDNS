

---

# QuikDNS

This is a simple Node.js DNS server that listens on a UDP socket, parses incoming DNS requests, and performs DNS resolution using Google's DNS-over-HTTPS service.

## Prerequisites

- Node.js installed on your machine
- Internet connectivity for making DNS-over-HTTPS requests

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/fawizzy/QuikDNS.git
   ```

2. Navigate to the project directory:

   ```bash
   cd QuikDNS
   ```

3. Run the DNS server:

   ```bash
    chmod u+x index.js
    ./index.js
   ```
   OR
   ```bash
    node index.js
   ```

   The server will start listening on UDP port 2222.

## Usage

  ```bash
   dig @127.0.0.1 -p <udp-server-port> <url>
  ```
example:
  ```bash
    dig @127.0.0.1 -p 2222 google.com
  ```


## DNS Request Format

The server expects DNS requests in the standard DNS format over UDP. The following information is logged for each incoming DNS request:

- Header information: ID, flags, question count, answer count, authority count, and additional count.
- Question section: Name, type, and class.

## DNS-over-HTTPS (DoH) Resolution

The server makes DNS queries to Google's DoH service (`https://dns.google/resolve`) for each incoming DNS request.

## Contributing

Feel free to contribute by opening issues or submitting pull requests. Contributions are welcome!

