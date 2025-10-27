# Fix Render Environment Variables

## Issue 1: Email might be wrong
Your current: `utmun-reader@utmun-ann.iam.gserviceaccount.com`
Should be: `utmun-reader@utmun-app.iam.gserviceaccount.com`

Fix: Edit `GOOGLE_CLIENT_EMAIL` and change `utmun-ann` to `utmun-app`

## Issue 2: Private Key Format

The `GOOGLE_PRIVATE_KEY` needs to have BEGIN and END lines.

**Copy THIS entire block to replace your current GOOGLE_PRIVATE_KEY:**

```
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDUsm8zfm5F2beh
RXPhSk+WI8wCkio+mWLehM76wKi1+BrrLM2C9zPN8bxounojzRQOH07elLwX7/0n
paWyPWFk2oFlDsrQR6vbOE8Rc8iWaDHi0qscxAhgtddU7NmIA4I8nR4GEr9TkG2b
/AcaL8fESQR7pR10tvgy6z6idpyBTAV04OY1qRj2PfdSzT6Kf0GM6N0K5hGcHUqI
7CdjwLZvPFwdXHfaHxOwYAPRteZiIed5MvJlrioPGwXCPHgBiQV8E3DyfOU6xqPX
LTvE06gE593D7OTxrcNnf3zwEM9145gILbboqQjRDELmzOQZS4XKl6FZbY33P8b+
gHzoDYHPAgMBAAECggEAXlrdy9ktcB06Qfe+hVXi4nb03LsctHJ1EsOV0lU/QqJS
xrs0XAHv4E95xnfbESC74dvvr/wJSRE0m673R4/FMelg94TNYgI5ceGT6ekUNez5
HGdac0NfeA+S++CqS5VK5DrLA+SzLY3nogf22p4Rn7jInVVNMOauSmBjg8zcdtqE
cm1n1fugetEPRXnt6oEKRTDrIxd8EM10zUAedBLK/X6ysCs4fefW34dmx+6P/mMJ
N/vCkkTrxcIXj9ls+FtIuhefGC/4+wZ+Tpc2EaYzlfhVwy8HRpRYW02/Fe+SU4rw
E9A5cy7UzITAAKymlfrQ8AXsGB3NKsamCmDqYtBH4QKBgQDx4GAKi9fx9qeXz/v6
Vil8K1mTZSMgiTr48Qr79BlIcVFMmuAWKqZWTkFzxI41UkwT/GV1kKT9+p5tyIBj
EOzFhnLj87XHxKeDHXh3yt1I5Fk3/cTW6uN8dixTeWqa/Afkf7vosRM8Bs55wosw
CZlZSMZWJ6ggiUWf+fLPhHwF3wKBgQDhHeDF79wsMtAFess/tbjniQhiwG15kqep
FiZmhxMDg6Gaqbb+Uu67/2G8jRGArTAYDh5lUAjPkHWbruFChwf3P/NdNbtZfOyL
6/+EixvK5SyVfP56+HwTpTf8KZHRcMBGmDHd92ilWzM9tDy1WaPvq/8rP32v7E0l
Jpq4XyaiEQKBgQCXKcEcFjXJVHt9F1DFLSAUKAt9YJHJfbpLZmmU+QLsEVXb6Fbv
w4vdGF8zeL3feSVuwCiwhst2pzBoMAx83VD8SYB4EhGjXbXK7ZoiU7hkG8HeikyA
fJ/bYwdky9biMWzFU0cer7vzodVcp0bRqM4bzK2XnoUmgGPxDQbAxm20RQKBgAXi
Uwq5b0bUeS17fS6IIHIk2cxC/VmNJMa9pnlNlIil+yZgw0C4iDbvwO09vrRfUn9+
dvrs8Z4DR5+vHYIwp1umF0Vbby8ynbg2jfI39J0ECntJzhkGv69/xQvZRk90JAJ0
XfFQUzLnRFqbiG6xDiDonP3TZgSgJ5AOB0NEcW0RAoGBAJlTN12XgGxM4459hok1
1h6xl0rrNZGq35Ag8trcQGqtADF1mDZ1mXjJkJZXsOxIqKMUzDtxJSR1hLVtgLfu
on3rn3aEtXPIYrVp1AyEomQpIrbwgS1vxxfLqnW7VffRsOsdGVizrb7LNqSok4Zq
+JYOr3OraFn8eFDZI8IERrn7
-----END PRIVATE KEY-----
```

**Steps:**
1. Delete the old `GOOGLE_PRIVATE_KEY` value
2. Paste the entire block above (including BEGIN and END lines)
3. Also fix the email from `utmun-ann` to `utmun-app`
4. Save - it will auto-redeploy

