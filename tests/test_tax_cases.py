import sys
from typing import Dict

# Ensure we can import from project root
# If this script is run with CWD at project/, this is not needed, but kept for safety
if '' not in sys.path:
    sys.path.insert(0, '')

from main import calculate_old_regime_tax, calculate_new_regime_tax


def test_old_regime_rebate_475k():
    # Taxable income 4.75L => rebate u/s 87A => 0 tax
    income = 475_000
    deductions: Dict[str, float] = {}
    assert calculate_old_regime_tax(income, deductions) == 0


def test_old_regime_rebate_500k():
    # Taxable income 5.00L => rebate u/s 87A => 0 tax
    income = 500_000
    deductions: Dict[str, float] = {}
    assert calculate_old_regime_tax(income, deductions) == 0


def test_old_regime_600k_taxable():
    # Taxable 6.00L => 12,500 (2.5-5L @5%) + 20,000 (5-6L @20%) = 32,500; with 4% cess => 33,800
    income = 600_000
    deductions: Dict[str, float] = {}
    assert calculate_old_regime_tax(income, deductions) == 33_800


def test_old_regime_10l_taxable():
    # Taxable 10.00L => 112,500 base; with 4% cess => 117,000
    income = 1_000_000
    deductions: Dict[str, float] = {}
    assert calculate_old_regime_tax(income, deductions) == 117_000


def test_old_regime_with_deductions_rebate():
    # Gross 7.00L, deductions 2.00L => taxable 5.00L => rebate => 0
    income = 700_000
    deductions: Dict[str, float] = {"total": 200_000}
    assert calculate_old_regime_tax(income, deductions) == 0


def test_new_regime_9l_income():
    # Gross 9.00L, std ded 50k => taxable 8.50L
    # 3-6L @5% => 15,000; 6-8.5L @10% => 25,000; base=40,000; with cess => 41,600
    income = 900_000
    assert calculate_new_regime_tax(income) == 41_600


def test_new_regime_11_5l_income():
    # Gross 11.50L, std ded 50k => taxable 11.00L
    # 3-6L: 15,000; 6-9L: 30,000; 9-11L: 30,000; base=75,000; with cess => 78,000
    income = 1_150_000
    assert calculate_new_regime_tax(income) == 78_000


def test_zero_income_both():
    assert calculate_old_regime_tax(0, {}) == 0
    assert calculate_new_regime_tax(0) == 0


def run_all():
    tests = [
        test_old_regime_rebate_475k,
        test_old_regime_rebate_500k,
        test_old_regime_600k_taxable,
        test_old_regime_10l_taxable,
        test_old_regime_with_deductions_rebate,
        test_new_regime_9l_income,
        test_new_regime_11_5l_income,
        test_zero_income_both,
    ]
    passed = 0
    for t in tests:
        t()
        print(f"PASS: {t.__name__}")
        passed += 1
    print(f"\n{passed}/{len(tests)} tests passed.")


if __name__ == "__main__":
    run_all()
