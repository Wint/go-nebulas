package nvm

import (
	"errors"

	"github.com/nebulasio/go-nebulas/core"
	"github.com/nebulasio/go-nebulas/core/state"
	"github.com/nebulasio/go-nebulas/storage"
	"github.com/nebulasio/go-nebulas/util"
	"github.com/nebulasio/go-nebulas/util/byteutils"
)

// Error Types
var (
	ErrEngineRepeatedStart      = errors.New("engine repeated start")
	ErrEngineNotStart           = errors.New("engine not start")
	ErrContextConstructArrEmpty = errors.New("context construct err by args empty")

	ErrExecutionFailed                 = errors.New("execution failed")
	ErrDisallowCallPrivateFunction     = errors.New("disallow call private function")
	ErrExecutionTimeout                = errors.New("execution timeout")
	ErrInsufficientGas                 = errors.New("insufficient gas")
	ErrExceedMemoryLimits              = errors.New("exceed memory limits")
	ErrInjectTracingInstructionFailed  = errors.New("inject tracing instructions failed")
	ErrTranspileTypeScriptFailed       = errors.New("transpile TypeScript failed")
	ErrUnsupportedSourceType           = errors.New("unsupported source type")
	ErrArgumentsFormat                 = errors.New("arguments format error")
	ErrLimitHasEmpty                   = errors.New("limit args has empty")
	ErrSetMemorySmall                  = errors.New("set memory small than v8 limit")
	ErrDisallowCallNotStandardFunction = errors.New("disallow call not standard function")
)

//define
var (
	EventNameSpaceContract = "chain.contract" //ToRefine: move to core
)

//common err
var (
	ErrKeyNotFound = storage.ErrKeyNotFound
)

// Const.
const (
	SourceTypeJavaScript = "js"
	SourceTypeTypeScript = "ts"
)

//transfer err code enum
const (
	TransferFuncSuccess = iota
	TransferGetEngineErr
	TransferAddressParseErr
	TransferGetAccountErr
	TransferStringToBigIntErr
	TransferSubBalance
	TransferAddBalance
)

// Block interface breaks cycle import dependency and hides unused services.
type Block interface {
	Hash() byteutils.Hash
	Height() uint64 // ToAdd: timestamp interface
	Timestamp() int64
	GetTransaction(hash byteutils.Hash) (*core.Transaction, error)
	RecordEvent(txHash byteutils.Hash, topic, data string) error
}

// Transaction interface breaks cycle import dependency and hides unused services.
type Transaction interface {
	Hash() byteutils.Hash
	From() *core.Address
	To() *core.Address
	Value() *util.Uint128
	Nonce() uint64
	Timestamp() int64
	GasPrice() *util.Uint128
	GasLimit() *util.Uint128
}

// Account interface breaks cycle import dependency and hides unused services.
type Account interface {
	Balance() *util.Uint128
	Nonce() uint64
	AddBalance(value *util.Uint128) error
	SubBalance(value *util.Uint128) error
	Put(key []byte, value []byte) error
	Get(key []byte) ([]byte, error)
	Del(key []byte) error
}

// WorldState interface breaks cycle import dependency and hides unused services.
type WorldState interface {
	GetOrCreateUserAccount(addr []byte) (state.Account, error)
}
