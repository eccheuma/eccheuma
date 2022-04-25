(module 
  (func $test (param i32 i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.add
    local.get 2
    i32.div_s
  )
  (export "testModule" (func $test))
)