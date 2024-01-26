CREATE TABLE [LogHopperRec](
	LogID bigint Primary Key IDENTITY(1,1),
	ProdDate date,
	RecpNameID int,
	BatchNo int,
	Shift int,
	StartTime Time,
	BatchEndTime Time,
	ProdUser nvarchar(256)
)

CREATE TABLE [LogHopperDwt](
	LogID bigint Primary Key IDENTITY(1,1),
	ProdDate date,
	RecpNameID int,
	StartTime datetime,
	EndTime datetime,
	IsOther bit,
	Cause nvarchar(256)
)

CREATE TABLE [LogHopperOp](
	LogID bigint Primary Key IDENTITY(1,1),
	ProdDate date,
	RecpNameID int,
	Lead1_1 nvarchar(256),
	ALead1_1 nvarchar(256),
	Lead2 nvarchar(256),
	ALead2 nvarchar(256),
	Lead3 nvarchar(256),
	ALead3 nvarchar(256),
	Lead1_2 nvarchar(256),
	ALead1_2 nvarchar(256),
	LeadDate date,
	ALeadDate date
)

