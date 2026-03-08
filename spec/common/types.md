## Data Types

### Basic Model Types

#### User
```go
type User struct {
    ID       int
    Username string
    Email    string
    Password string
    IsAdmin  bool
}
```

#### Fund
```go
type Fund struct {
    ID       uint
    Name     string
    IsExcept bool  // default: false
}
```

#### Asset
```go
type Asset struct {
    ID        uint
    Name      string
    Category  Category  // Enum: 1=현금, 2=달러, 3=금, 4=단기채권, 5=국내ETF, 6=국내주식, 7=국내코인, 8=해외주식, 9=해외ETF, 10=레버리지, 11=해외코인, 12=국내안전자산ETF
    Code      string
    Currency  string    // "WON" or "USD"
    Top       float64
    Bottom    float64
    SellPrice float64
    BuyPrice  float64
    CreatedAt time.Time
    UpdatedAt time.Time
    DeletedAt time.Time
}
```

#### Invest
```go
type Invest struct {
    ID        uint
    FundID    uint
    Fund      Fund
    AssetID   uint
    Asset     Asset
    Price     float64
    Count     float64
    CreatedAt time.Time
    UpdatedAt time.Time
    DeletedAt time.Time
}
```

#### InvestSummary
```go
type InvestSummary struct {
    ID      uint
    FundID  uint
    Fund    Fund
    AssetID uint
    Asset   Asset
    Count   float64
    Sum     float64
}
```

#### Market
```go
type Market struct {
    ID        uint
    Status    uint      // MarketLevel: 1=MAJOR_BEAR, 2=BEAR, 3=VOLATILIY, 4=BULL, 5=MAJOR_BULL
    CreatedAt time.Time
}
```

#### DailyIndex
```go
type DailyIndex struct {
    CreatedAt      time.Time
    FearGreedIndex uint
    NasDaq         float64
    Sp500          float64
}
```

#### CliIndex
```go
type CliIndex struct {
    CreatedAt time.Time
    Index     float64
}
```

#### HighYieldSpread
```go
type HighYieldSpread struct {
    CreatedAt time.Time
    Spread    float64
}
```

#### EmaHist
```go
type EmaHist struct {
    ID      uint
    AssetID uint
    Asset   Asset
    Date    time.Time
    Ema     float64
    NDays   uint
}
```

### Category Enum
```
1  = 현금 (Won)
2  = 달러 (Dollar)
3  = 금 (Gold)
4  = 단기채권 (ShortTermBond)
5  = 국내ETF (DomesticETF)
6  = 국내주식 (DomesticStock)
7  = 국내코인 (DomesticCoin)
8  = 해외주식 (ForeignStock)
9  = 해외ETF (ForeignETF)
10 = 레버리지 (Leverage)
11 = 해외코인 (ForeignCoin)
12 = 국내안전자산ETF (DomesticStableETF)
```

Stable categories: 현금, 달러, 금, 단기채권, 국내안전자산ETF

### Currency Enum
```
WON (KRW)
USD
```

### Market Level Enum
```
1 = MAJOR_BEAR (Max volatile: 15%, Min volatile: 10%)
2 = BEAR (Max volatile: 20%, Min volatile: 15%)
3 = VOLATILIY (Max volatile: 25%, Min volatile: 20%)
4 = BULL (Max volatile: 30%, Min volatile: 25%)
5 = MAJOR_BULL (Max volatile: 40%, Min volatile: 30%)
```
