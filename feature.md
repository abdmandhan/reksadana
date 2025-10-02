# Qiblat URS

# Feature

## Roles
1. Investor
- Retail
- Corporate
- Selling Agent
2. Operator
- Maker
- Approval
3. Sales
- Retail
- Corporate
- Selling Agent
- Online

## Transaction
- Semua transaksi bisa menggunakan fee atau tidak
- Pembatasan switching (user tidak bisa melakukan switching back ke produk sebelumnya, harus tunggu H+X)
- EOD process
- Investor Transactions per Sales
1. Subscription
2. Redemption
3. Switching Out
4. Switching IN

## Investor
- Constrain to Sales

## Sales
- Sales Tree
- Tiering (Group, Head, Sales, Sub Sales)
- KPI
- History Pemindahan Sales

## Product
- Product type ada yang Open / Close untuk investor tertentu
- Management Fee
	- Fix percentage
	- Tiering
		- Based on amount
- Subscription Fee
- Redemption Fee
- Switching Fee
- Hari (366/365/360) untuk perhitungan MgFee
- Valuta (Currency) - Kurs tengah
- Type
1. Money Market
2. Fix Income
3. Combine
4. Saham
5. Index
6. KPD / Discrenary Fund
7. RDPT


## NAV
- Retrieve from external system
- NAV/Unit = NAV Today / Outstanding Unit Kemarin 
- MgFee Hari ini = NAV kemarin * mgFee percent / 365 * hari
- Untuk perhitungan sales -> Unit Sales / MgFee
- NAV decimals (4) -> truncate/round up -> valuta asing (7)
