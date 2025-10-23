# WalletPage Code Review & Refactoring Guide

This document outlines issues found in the `WalletPage` component implementation and provides detailed solutions for improvement.

## Issues Found & Solutions

### 1. **Type Definitions - Interface Duplication**

**Issue:** The interfaces `WalletBalance` and `FormattedWalletBalance` are quite similar with 2 identical fields `currency` and `amount`.

**Solution:** Use `extends` or `Pick` to reuse the same fields.

```typescript
// Before
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// After
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}
```

**Benefits:**

- Consistency between related interfaces
- Easier to maintain in future as we only need to update one place instead of multiple places

---

### 2. **Component Props - Unnecessary Interface**

**Issue:** Unnecessary `Props` interface declaration

**Solution:** Use `BoxProps` directly instead of creating a wrapper interface

---

### 3. **Inappropriate Type Choice**

**Issue:** `BoxProps` is only used for passing props into `<div>` element and `children` is not used anywhere

**Solution:** Use `HTMLAttributes<HTMLDivElement>` instead as it always reflects every possible props of div element

---

### 4. **Performance - Function Definition Inside Component**

**Issue:** `getPriority` is a function that can be moved out of the component as it doesn't depend on any component's logic

**Solution:** Move this function out of the component

**Benefits:**

- The component doesn't have to render `getPriority` every time it re-renders
- Makes the component shorter
- The logic of `getPriority` can be reused everywhere else in the App

---

### 5. **Type Safety - Avoid `any` Type**

**Issue:** `blockchain` parameter is defined as `any` type

**Solution:** Avoid `any` type, use string instead as all compared values are strings

**Note:** As I don't have full context of this code, so in some scenarios, `any` type might be acceptable

---

### 6. **Missing type declaration**

**Issue:** `blockchain` field is not defined in `WalletBalance` interface

**Solution:** define blockchain value in WalletBalance

### 7. **Logic Errors - Variable Issues**

**Issue:** `balancePriority` variable is initialized but not used while `lhsPriority` is not defined

**Solution:** Use `balancePriority` instead of `lhsPriority` (I guess from what I can see)

---

### 8. **Magic Numbers**

**Issue:** The code compares `lhsPriority` with `-99` which looks like a magic number

**Solution:** Use a variable such as `LOWEST_PRIORITY` for -99 value or let the `getPriority` return `null` instead of `-99`

**Benefits:**

- Easier for other developers to read
- Avoid unhappy cases in future such as some blockchain getting a priority lower than -99

---

### 9. **Code Complexity - Nested Conditions**

**Issue:** Using 2 if conditions (`lhsPriority > -99` and `balance.amount <= 0`) for only one result

**Solution:** Use `&&` condition instead to reduce the complexity of the function

---

### 10. **Sort Function - Incomplete Comparator**

**Issue:** The sort comparator doesn't return 0 for equal priorities

---

### 11. **Performance - Unnecessary Dependencies**

**Issue:** Redundant dependency `prices` in useMemo

**Solution:** Remove unnecessary dependencies from useMemo dependency array

---

### 12. **Unused Variables**

**Issue:** `formattedBalances` is not used anywhere

**Solution:** Remove unused variable or implement its intended usage

---

### 13. **Missing Memoization**

**Issue:** In case `formattedBalances` is used some where. A mapping function has expensive cost and should be declared with `useMemo` to avoid unnecessary reruns

---

### 14. **Formatting Precision**

**Issue:** `toFixed()` without precision, so it's always 0 decimals which is not user friendly for prices

---

### 15. **Performance - Component Rendering**

**Issue:** The `rows` returns a list of components which is expensive

**Solution:** Wrap with `useMemo` hook to prevent unnecessary re-renders

---

### 16. **Unsafe Property Access**

**Issue:** `prices[balance.currency]` is not safe as it can be undefined

**Solution:** Declare a variable for that, then check the value before continuing the logic

---

### 17. **Missing variable declaration**

**Issue:** `classes.row` is not defined

---

### 18. **Poor Key Prop Usage**

**Issue:** Using index as key for `WalletRow` component

**Solution:** Use `balance.currency` instead which is more likely to be unique for a key
