# -*- coding: utf-8 -*-

# テストスイートを管理するクラス
class TestCase:
    def __init__(self, name):
        self.name = name
    def setUp(self):
        pass
    def tearDown(self):
        pass
    #  テストメソッドを動的に呼び出す
    def run(self):
        result = TestResult()
        result.testStarted()
        self.setUp()
        method = getattr(self, self.name)
        method()
        self.tearDown()
        return result

# テストメソッドが実行されたか記録するクラス
class WasRun(TestCase):
    def setUp(self):
        self.log = "setUp "
    # メソッドが実行されたか記録するメソッド
    def testMethod(self):
        self.log = self.log + "testMethod "
    def testBrokenMethod(self):
        raise Exception
    def tearDown(self):
        self.log = self.log + "tearDown "

class TestResult:
    def __init__(self):
        self.runCount =0
    def testStarted(self):
        self.runCount = self.runCount + 1
    def summary(self):
        return "1 run, 0 failed"

# テストスイートをテストするクラス
class TestCaseTest(TestCase):
    def testTemplateMethod(self):
        test = WasRun("testMethod")
        test.run()
        assert("setUp testMethod tearDown " == test.log)
    def testResult(self):
        test = WasRun("testMethod")
        result = test.run()
        assert("1 run, 0 failed" == result.summary())
    def testFailedResult(self):
        test = WasRun("testBrokenMethod")
        result = test.run()
        assert("1 run, 1 failed" == result.summary())

TestCaseTest("testTemplateMethod").run()
TestCaseTest("testResult").run()
# TestCaseTest("testFailedResult").run()
