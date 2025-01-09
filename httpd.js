var http = require("http"),
    https = require('https'),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    //httpport = process.argv[2] || 80;
    httpport = 80;
    httpsport = 443;

/*var key = fs.readFileSync('ssl/private.key');
var cert = fs.readFileSync( 'ssl/certificate.crt' );
var ca = fs.readFileSync( 'ssl/ca.pem' );*/

var key = new Buffer('LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQ0KTUlJRXBBSUJBQUtDQVFFQTFsK2hYUjVrK1lqVGkzSWZMU0FrUHZySUo5UEliRGZKbVJrUjZnbFBBRUhTQ1luZQ0Kem1MOEx0b05wKzk2c3JjYmUwbmtWRFRNMnB2WFNLT2Z0b3RzZDhOQW5kbWdUY2tnWmtNY0RUcTMxT3dMS2FuMA0KQTNvbnJtdjZmZWQxMmRIcjRBaW1mUXZrS0ExMG5zYnVNeEV6dDBsWmlzeUVvYitCbDIwVi9USHYwK2Rqc2w2Kw0KNWMwNDdtYUlxWFJmVktQQnMwMC91bnlSRmRzcDN0WFlHMHJibGNGWmZmL0pMaTVhd1FJNEZ1MzliL3NvbDJZbQ0KQ2VHRVg0UmpUYUlYUUxDOUNUdEdCT3Bza1E4NW83d01lQTRHK1kvdnhYait6dXg5aDRucGx4b1JWOFRrUmZEUg0KbGNGWWpTanoxWkdsV01Ta3dtZzZsemZXUXhEdFNZK0RYV1BwVlFJREFRQUJBb0lCQUY3SE13R0hnWjh0bGxITg0KcCtqOGorbmtXSC83UzE1RkgvVjNOd3RoQ0RPVjVqWGZaY21ieStFdStPQ3BxWGJBSy85TFFRN1Z0VWhscEQzeQ0KVVplVWR1VlFSdzVDL0hQSG0zSjY4emtLSCtLY1phY0xBOTVSc0orV0Q4NkFlZ05PbzFtT21ZVXByN3Joa0JEdQ0KNUx0aFBKc3BhOVJJN2M3UmE0czJhSVZrQWFPT2wwWjRNeGdmbjRRcE5XZFg3V0wxWEdFMGlDUnVjZjhrRlJqZA0KY2hUNXdoZmxJV3IxMzhjMEZLZGYreU1hQUk3S1FyeXpvOU9na0s0N285azRzVG1sREJzWXpwcWZQaFVQNjdZMg0KdExwREhsNTZOY0RFcTN4TnZBOUhreit1M2t6RkdvY0lIVEJuWjR2L2UwNjRqbkNIc3VScE1ZeVh3dDNIYVVVRg0KUUpVdFdhRUNnWUVBKzBWMG1PL0dvRGYycVkrdE1ZQUE2RVBNdVF0WEdsN09PdDlrWDFoSFl1Rkw1aU5ZZ1NJNQ0KVTdyWngzcnAydHZvaEZJNW42MUswVmovYmlqajhuKzk0TUZiTXJJNmJBUFlUYzNWd1pzM2xGOWcvUlQyY01BZw0KMURZeUtQM2xFeHVYa3YxZ1lqUGFzbHZUZGRsenJjeFVEcFExUjU0M2VWUDFrY2JtT3JNc2lra0NnWUVBMm1ocA0Kejk0eklRODA2d08ycjZOdlkrRFFkc1cweldJWmJ1eFdOTzRoZWFtRTBqTC9tL2k3cE9EcnVvcXI0aHdaNkl5Sw0KbHEyTkRyRkdSV2RhKzIyeE1Nd0t0NEQzdUZqL215UjNwQkFwcVM1UExVSWNRam01VHJadDk5eEJubWNmRXBIcQ0KenZVQ3ZKcWo5clVPaFluU3h3QzVOWTUveDc4dzdIdkJvTnFteHEwQ2dZRUE5TE1rSkpoRmw5eElVOEsvQ05pKw0KaVhNVm1ST0pKUDQwMnJLWTNoMXJqOGtXa0MzVjBCUlRQYzVXcmVSdWY1dnZhWVZsNXJIdGpjaWRJRnVqK1pJYg0KaVJqa1JvKzVRMTNQTlo0QjBFVG5zSS9lTlRsSDhtKzR5TkZxc2U3b09sNkJrejA3c3djS3NPMnFGamZKWnZUNA0KMnlYTWFVMlVlb3lnTnZJN1hla0Z0RGtDZ1lCMXE1MmVsYnQ4UzBJYWdIU3pxbDFBTllaN0IwZkRBK0JxQjhEbQ0KWVluOWoxeDFGMjdwckpnRVcvNEZFZU5MUGhLalhOenFFM1VVL21PNnp0V1E4dWR0UC9GaUxvVEllSUsySm02ag0KSU9ZaE5VY0pQajRWWEI0L2owQXVNeWZUWFFHN3Nvd01scXF6ektrY0tTNDZ1aWVxZWZSUEs0Z2lxUnFGdnFOeQ0KczNyNVBRS0JnUURnODZBcWh3RDBJdGRzRWdwVmNvTkhhQ0hTcHNwMnozUlZxeThHa3JuVTluRyt5bW4xQnFZMQ0KelZYL0ZBYmlOMEtZNHJEZHJ0SWQ4WGhaTG1pNzFONWRoSFpZSzZhMHl6bXpUOGltVE9hVW5pRDN0OHh0MG8zSA0KM0JxOEJFTHcyWmtCd1JHOUlvR2tSWTgwaG5ockw3am4xdVNFNXFrV0prMU1DditMRlhxSXV3PT0NCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0t', 'base64');
var cert = new Buffer('LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tDQpNSUlHTWpDQ0JScWdBd0lCQWdJREZGVzNNQTBHQ1NxR1NJYjNEUUVCQ3dVQU1JR01NUXN3Q1FZRFZRUUdFd0pKDQpUREVXTUJRR0ExVUVDaE1OVTNSaGNuUkRiMjBnVEhSa0xqRXJNQ2tHQTFVRUN4TWlVMlZqZFhKbElFUnBaMmwwDQpZV3dnUTJWeWRHbG1hV05oZEdVZ1UybG5ibWx1WnpFNE1EWUdBMVVFQXhNdlUzUmhjblJEYjIwZ1EyeGhjM01nDQpNU0JRY21sdFlYSjVJRWx1ZEdWeWJXVmthV0YwWlNCVFpYSjJaWElnUTBFd0hoY05NVFF4TVRFME1EVXpOelEzDQpXaGNOTVRVeE1URTFNREl3TXpNMVdqQkhNUXN3Q1FZRFZRUUdFd0pXVGpFWE1CVUdBMVVFQXhNT2QzZDNMbmh1DQpiMmhoZEM1amIyMHhIekFkQmdrcWhraUc5dzBCQ1FFV0VIaHViMmhoZEVCbmJXRnBiQzVqYjIwd2dnRWlNQTBHDQpDU3FHU0liM0RRRUJBUVVBQTRJQkR3QXdnZ0VLQW9JQkFRRFdYNkZkSG1UNWlOT0xjaDh0SUNRKytzZ24wOGhzDQpOOG1aR1JIcUNVOEFRZElKaWQ3T1l2d3UyZzJuNzNxeXR4dDdTZVJVTk16YW05ZElvNSsyaTJ4M3cwQ2QyYUJODQp5U0JtUXh3Tk9yZlU3QXNwcWZRRGVpZXVhL3A5NTNYWjBldmdDS1o5QytRb0RYU2V4dTR6RVRPM1NWbUt6SVNoDQp2NEdYYlJYOU1lL1Q1Mk95WHI3bHpUanVab2lwZEY5VW84R3pUVCs2ZkpFVjJ5bmUxZGdiU3R1VndWbDkvOGt1DQpMbHJCQWpnVzdmMXYreWlYWmlZSjRZUmZoR05Ob2hkQXNMMEpPMFlFNm15UkR6bWp2QXg0RGdiNWorL0ZlUDdPDQo3SDJIaWVtWEdoRlh4T1JGOE5HVndWaU5LUFBWa2FWWXhLVENhRHFYTjlaREVPMUpqNE5kWStsVkFnTUJBQUdqDQpnZ0xmTUlJQzJ6QUpCZ05WSFJNRUFqQUFNQXNHQTFVZER3UUVBd0lEcURBVEJnTlZIU1VFRERBS0JnZ3JCZ0VGDQpCUWNEQVRBZEJnTlZIUTRFRmdRVU95dkZOd1ZyY2F1UUNtN2JJUmNDU3ZaRWZna3dId1lEVlIwakJCZ3dGb0FVDQo2MEkwMEppd3E1LzBHMnNJOTh4a0x1OE9MRVV3SlFZRFZSMFJCQjR3SElJT2QzZDNMbmh1YjJoaGRDNWpiMjJDDQpDbmh1YjJoaGRDNWpiMjB3Z2dGV0JnTlZIU0FFZ2dGTk1JSUJTVEFJQmdabmdRd0JBZ0V3Z2dFN0Jnc3JCZ0VFDQpBWUcxTndFQ0F6Q0NBU293TGdZSUt3WUJCUVVIQWdFV0ltaDBkSEE2THk5M2QzY3VjM1JoY25SemMyd3VZMjl0DQpMM0J2YkdsamVTNXdaR1l3Z2ZjR0NDc0dBUVVGQndJQ01JSHFNQ2NXSUZOMFlYSjBRMjl0SUVObGNuUnBabWxqDQpZWFJwYjI0Z1FYVjBhRzl5YVhSNU1BTUNBUUVhZ2I1VWFHbHpJR05sY25ScFptbGpZWFJsSUhkaGN5QnBjM04xDQpaV1FnWVdOamIzSmthVzVuSUhSdklIUm9aU0JEYkdGemN5QXhJRlpoYkdsa1lYUnBiMjRnY21WeGRXbHlaVzFsDQpiblJ6SUc5bUlIUm9aU0JUZEdGeWRFTnZiU0JEUVNCd2IyeHBZM2tzSUhKbGJHbGhibU5sSUc5dWJIa2dabTl5DQpJSFJvWlNCcGJuUmxibVJsWkNCd2RYSndiM05sSUdsdUlHTnZiWEJzYVdGdVkyVWdiMllnZEdobElISmxiSGxwDQpibWNnY0dGeWRIa2diMkpzYVdkaGRHbHZibk11TURVR0ExVWRId1F1TUN3d0txQW9vQ2FHSkdoMGRIQTZMeTlqDQpjbXd1YzNSaGNuUnpjMnd1WTI5dEwyTnlkREV0WTNKc0xtTnliRENCamdZSUt3WUJCUVVIQVFFRWdZRXdmekE1DQpCZ2dyQmdFRkJRY3dBWVl0YUhSMGNEb3ZMMjlqYzNBdWMzUmhjblJ6YzJ3dVkyOXRMM04xWWk5amJHRnpjekV2DQpjMlZ5ZG1WeUwyTmhNRUlHQ0NzR0FRVUZCekFDaGpab2RIUndPaTh2WVdsaExuTjBZWEowYzNOc0xtTnZiUzlqDQpaWEowY3k5emRXSXVZMnhoYzNNeExuTmxjblpsY2k1allTNWpjblF3SXdZRFZSMFNCQnd3R29ZWWFIUjBjRG92DQpMM2QzZHk1emRHRnlkSE56YkM1amIyMHZNQTBHQ1NxR1NJYjNEUUVCQ3dVQUE0SUJBUUJnUndzT1pJUk0wbHZwDQpVb3NuL0dIUnd2T2FYMERRRk8yOWdRUFp2YjBaVUJYS0U3N3BqWk81TEFwUnpUMUVOOGhEVFd0RHdxd0pncWxODQpGZSsrMUhvaWxCWFdneTlWSkdQQ0dFemVSSkNJcUVEUU9uZ3hjRWZsN2RXNTIweHZ1UW9xbGhkeU1QV1N6THhyDQo2UzlzS3BMd3NzajcvNnVyU25KTmZiT05hWU5MNGFXMWV1cWZzQXVzLzVTS1p4RUljbWVvU3c4MFA2c2RNSTBQDQpBaHFGL0pvRFN5c3RsNUhOV2l5elRmcUVKc2U4VHYxL2ExMUh1TFlwUXFMaWRpWWx1SjhhSk5RS1hqQTlKRVNYDQo5Y05CckE4V2huTDJQK04rWWRDczJycGd4ZjRGSHVVbjRxNVFNcXpnUUdJNCtld1JCcnJpOG1oeWlXaEd3Rng5DQoxR1ZCOFpuMw0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQ==', 'base64');
var ca = new Buffer('LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tDQpNSUlIeVRDQ0JiR2dBd0lCQWdJQkFUQU5CZ2txaGtpRzl3MEJBUVVGQURCOU1Rc3dDUVlEVlFRR0V3SkpUREVXDQpNQlFHQTFVRUNoTU5VM1JoY25SRGIyMGdUSFJrTGpFck1Da0dBMVVFQ3hNaVUyVmpkWEpsSUVScFoybDBZV3dnDQpRMlZ5ZEdsbWFXTmhkR1VnVTJsbmJtbHVaekVwTUNjR0ExVUVBeE1nVTNSaGNuUkRiMjBnUTJWeWRHbG1hV05oDQpkR2x2YmlCQmRYUm9iM0pwZEhrd0hoY05NRFl3T1RFM01UazBOak0yV2hjTk16WXdPVEUzTVRrME5qTTJXakI5DQpNUXN3Q1FZRFZRUUdFd0pKVERFV01CUUdBMVVFQ2hNTlUzUmhjblJEYjIwZ1RIUmtMakVyTUNrR0ExVUVDeE1pDQpVMlZqZFhKbElFUnBaMmwwWVd3Z1EyVnlkR2xtYVdOaGRHVWdVMmxuYm1sdVp6RXBNQ2NHQTFVRUF4TWdVM1JoDQpjblJEYjIwZ1EyVnlkR2xtYVdOaGRHbHZiaUJCZFhSb2IzSnBkSGt3Z2dJaU1BMEdDU3FHU0liM0RRRUJBUVVBDQpBNElDRHdBd2dnSUtBb0lDQVFEQmlOc0p2R3hHZkhpZmxYdTFNNUR5Y21MV3dUWWdJaVJlenVsMzhrTUtvZ1prDQpwTXlPTnZnNDVpUHdibTJ4UE4xeW80VWNvZE05dERNcjB5K3YvdXF3UVZsbnRzUUdmUXFlZElYV2VVeUFOM3JmDQpPUVZTV2ZmMEcwWkRwTktGaGRMRGNmTjFZalM2TElwL0hvL3U3VFRRRWNlV3pWSTl1alBXM1UzZUN6dEtTNS9DDQpKaS82dFJZY2NqVjN5anhkNXNyaEpvc2FOblpjQWR0MEZDWCs3YldnaUEvZGVNb3RId2VYTUFFdGNubjZSdFlUDQpLcWk1cHF1RFNSM2w4dS9kNUFHT0dBcVBZMU1XaFdLcERoazZ6TFZtcHNKcmRBZmtLK0YyUHJSdDJQWkU0WE5pDQpIenZFdnFCVFZpVnNVUW4zcXF2S3YzYjliWnZ6bmR1L1BXYThERmFxcjVoSWxUcEwzNmRZVU5rNGRhbGI2a01NDQpBditaNitoc1RYQmJLV1djM2FwZHpLOEJNZXdNNjlLTjZPcWNlK1p1OXlkbURCcEkxMjVDNHovZUlUNTc0UTF3DQorMk9xcUd3YVZMUmNKWHJKb3NtTEZxYTdMSDRYWGdWTldHNFNIUUh1RWhBTnhqSi9HUC84OVByTmJwSG9Oa20rDQpHa2hwaThLV1RSb1NzbWtYd1FxUTF2cDVJa2kvdW50cCtIREgrbm8zMk5nTjBuWlBWLytRdCtPUjB0M3Z3bUMzDQpaenJkL3FxYzhOU0xmM0lpenNhZmw3YjRyNHFnRUtqWit4akd0clZjVWp5SnRoa3Fjd0VLRHdPekVtRHllaStCDQoyNk51L3lZd2wvV0wzWWxYdHEwOXM2OHJ4YmQyQXZDbDFpdWFoaFFxY3Ziak00eGRDVXNUMzd1TWRCTlNTd0lEDQpBUUFCbzRJQ1VqQ0NBazR3REFZRFZSMFRCQVV3QXdFQi96QUxCZ05WSFE4RUJBTUNBYTR3SFFZRFZSME9CQllFDQpGRTRMN3hxa1FGdWxGMm1ITU1vMGFFUFFRYTd5TUdRR0ExVWRId1JkTUZzd0xLQXFvQ2lHSm1oMGRIQTZMeTlqDQpaWEowTG5OMFlYSjBZMjl0TG05eVp5OXpabk5qWVMxamNtd3VZM0pzTUN1Z0thQW5oaVZvZEhSd09pOHZZM0pzDQpMbk4wWVhKMFkyOXRMbTl5Wnk5elpuTmpZUzFqY213dVkzSnNNSUlCWFFZRFZSMGdCSUlCVkRDQ0FWQXdnZ0ZNDQpCZ3NyQmdFRUFZRzFOd0VCQVRDQ0FUc3dMd1lJS3dZQkJRVUhBZ0VXSTJoMGRIQTZMeTlqWlhKMExuTjBZWEowDQpZMjl0TG05eVp5OXdiMnhwWTNrdWNHUm1NRFVHQ0NzR0FRVUZCd0lCRmlsb2RIUndPaTh2WTJWeWRDNXpkR0Z5DQpkR052YlM1dmNtY3ZhVzUwWlhKdFpXUnBZWFJsTG5Ca1pqQ0IwQVlJS3dZQkJRVUhBZ0l3Z2NNd0p4WWdVM1JoDQpjblFnUTI5dGJXVnlZMmxoYkNBb1UzUmhjblJEYjIwcElFeDBaQzR3QXdJQkFScUJsMHhwYldsMFpXUWdUR2xoDQpZbWxzYVhSNUxDQnlaV0ZrSUhSb1pTQnpaV04wYVc5dUlDcE1aV2RoYkNCTWFXMXBkR0YwYVc5dWN5b2diMllnDQpkR2hsSUZOMFlYSjBRMjl0SUVObGNuUnBabWxqWVhScGIyNGdRWFYwYUc5eWFYUjVJRkJ2YkdsamVTQmhkbUZwDQpiR0ZpYkdVZ1lYUWdhSFIwY0RvdkwyTmxjblF1YzNSaGNuUmpiMjB1YjNKbkwzQnZiR2xqZVM1d1pHWXdFUVlKDQpZSVpJQVliNFFnRUJCQVFEQWdBSE1EZ0dDV0NHU0FHRytFSUJEUVFyRmlsVGRHRnlkRU52YlNCR2NtVmxJRk5UDQpUQ0JEWlhKMGFXWnBZMkYwYVc5dUlFRjFkR2h2Y21sMGVUQU5CZ2txaGtpRzl3MEJBUVVGQUFPQ0FnRUFGbXlaDQo5R1lNTlBYUWhWNTlDdXphRUU0NEhGN2ZwaVVGUzVFeXdlZzc4VDNkUkFsYkIwbUtLY3RtQXJleG12Y2xtQWs4DQpqaHZoM1RhSEswdTdhTk01WmoyZ0pzZnlPWkVkVWF1Q2UzN1Z6bHJrNGdOWGNHbVhDUGxlV0tZSzM0d0dta1VXDQpGamdLWGxmMllzZDZBZ1htdkI2MThwNzBxU21EK0xJVTQyNG9oMFREa0JyZU9LazhyRU5OWkVYTzNTaXBYUEp6DQpld1Q0RitpcnNmTXVYR1J1Y3pFNkVyaThzeEhrZlkrQlVabzdqWW4wVFpObWV6d0Q3ZE9hSFpyelpWRDFvTkIxDQpueSt2OE9xQ1E1ajRhWnlKZWNSRGprWnk0MlEyRXEvM0pSNDRpWkIzZnNOcmFybkR5MFJMckhpUWkrZkhMQjVMDQpFVVRJTkZJbnpRcGRuNFhCaWRVYWVQS1ZFRk15M1lDRVpuWFp0V2dvKzJFdXZvU29PTUNaRW9hbEhtZGtyUVl1DQpMNmx3aGNlV0QzeUpaZldPUTFRT3E5MmxnRG1VWU1BMHlaWndMS01TOVI5SWU3MGNmbXUzblpEMElqdXUrUHdxDQp5dnFDVXFEdnIwdFZrK3ZCdGZBaWk2dzBUaVlpQktHSExIVkt0K1Y5RTllNERHVEFOdExKTDRZU2pDTUp3UnVDDQpPM05KbzJwWGg1VGwxbmpGbVVOajQwM2dkeTNoWlpseWFRUWFSd25tRHdGV0pQc2Z2dzU1cVZndXVjUUpBWDZWDQp1bTBBQmo2eTZrb1FPZGpRSy9XLzdIVy9sd0xGQ1JzSTNGVTM0b0g3TjRSRFlpREs1MVpMWmVyK2JNRWtreVNoDQpOT3NGLzVvaXJwdDlQL0ZsVVFxbU1HcXo5SWdjZ0EzOGNvcm9nMTQ9DQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tDQo=', 'base64');

var httpsoptions = {
  key: key,
  cert: cert,
  ca: ca
};

console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
console.log("\t\t=====[ xnohathttpd static file http server ]=====\n\n");
httpd(); // Start HTTPD Server
httpsd(); // Start HTTPSD Server


//Resume from UnCaughtException Error
process.on('uncaughtException', function (err) {
  console.log('Error in handle request:');
  console.error(err);
  console.log('Restarting httpd...');
  if(global.serverinstance != ''){ // if existed instance
    global.serverinstance.close(); //Terminate old server before relaunch
  }
  httpd();
  httpsd();
});



function httpd(){

  global.httpserverinstance = http.createServer(function(request, response) {

    var uri = url.parse(request.url).pathname
      , filename = path.join(process.cwd(), uri);

    //DEBUG
    //console.log('URI: ' + uri);
    //console.log('Hostname: ' + hostname);
    //console.log('Filename: ' + filename);

    var contentTypesByExtension = {
      '.html': "text/html",
      '.css':  "text/css",
      '.js':   "text/javascript"
    };

    fs.exists(filename, function(exists) {
      if(!exists) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
      }

      if (fs.statSync(filename).isDirectory()) filename += '/index.html';

      fs.readFile(filename, "binary", function(err, file) {
        if(err) {        
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;
        }

        var headers = {};
        var contentType = contentTypesByExtension[path.extname(filename)];
        if (contentType) headers["Content-Type"] = contentType;
        response.writeHead(200, headers);
        response.write(file, "binary");
        response.end();
      });
    });
  }).listen(parseInt(httpport, 10));

  console.log('Current directory: ' + process.cwd());
  console.log("Static file HTTP server running at\n  => http://localhost:" + httpport + "/\nCTRL + C to shutdown");

return httpserverinstance
} //END Function


function httpsd(){

  global.httpsserverinstance = https.createServer(httpsoptions,function(request, response) {

    var uri = url.parse(request.url).pathname
      , filename = path.join(process.cwd(), uri);

    //DEBUG
    //console.log('URI: ' + uri);
    //console.log('Hostname: ' + hostname);
    //console.log('Filename: ' + filename);

    var contentTypesByExtension = {
      '.html': "text/html",
      '.css':  "text/css",
      '.js':   "text/javascript"
    };

    fs.exists(filename, function(exists) {
      if(!exists) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
      }

      if (fs.statSync(filename).isDirectory()) filename += '/index.html';

      fs.readFile(filename, "binary", function(err, file) {
        if(err) {        
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;
        }

        var headers = {};
        var contentType = contentTypesByExtension[path.extname(filename)];
        if (contentType) headers["Content-Type"] = contentType;
        response.writeHead(200, headers);
        response.write(file, "binary");
        response.end();
      });
    });
  }).listen(parseInt(httpsport, 10));

  console.log('Current directory: ' + process.cwd());
  console.log("Static file HTTPS server running at\n  => http://localhost:" + httpsport + "/\nCTRL + C to shutdown");

return httpsserverinstance
} //END Function


