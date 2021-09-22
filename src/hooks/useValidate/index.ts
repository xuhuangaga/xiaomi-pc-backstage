import { ElMessage } from 'element-plus'
import { FormInstance } from '../../types/form'

export const useValidate = (form:FormInstance | undefined, cb: () => void, errMessage = '表单验证失败,请检查') => {
  form && form.validate((valid: any) => {
    if (valid) cb()
    else {
      ElMessage.error(errMessage)
      return
    }
  })
}