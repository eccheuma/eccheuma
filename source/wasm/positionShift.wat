(module
  ;; fucntion posShift(1440, 720 | 1440, 1440 | 1440, 0) => 0 | 1 | -1
  (func $positionShift (export "posShift") 

    (param $w f32) (param $pos f32) 
    (local $b f32)
    (result f32)
    
    ;; get center of window
    local.get $w
    f32.const 2
    f32.div
    local.set $b
    
    ;; normlize
	  local.get $pos
    local.get $b
    f32.div
    f32.const 1
    f32.sub
    
    ;; save norm result
    local.tee $b
    
    ;; square ease
    f32.abs
    local.get $b
    f32.mul

  )
)