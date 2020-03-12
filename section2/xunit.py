# -*- coding: utf-8 -*-

# テストスイートを管理するクラス
class TestCase:
    def __init__(self, name):
        self.name = name
    def setUp(self):
        pass
    #  テストメソッドを動的に呼び出す
    def run(self):
        self.setUp()
        method = getattr(self, self.name)
        method()

# テストメソッドが実行されたか記録するクラス
class WasRun(TestCase):
    def setUp(self):
        self.wasRun = None
        self.wasSetUp = 1
    # メソッドが実行されたか記録するメソッド
    def testMethod(self):
        self.wasRun = 1


# テストスイートをテストするクラス
class TestCaseTest(TestCase):
    def setUp(self):
        self.test = WasRun("testMethod")
    def testRunning(self):
        self.test.run()
        assert(self.test.wasRun)
    def testSetUp(self):
        print('testsetup')
        self.test.run()
        assert(self.test.wasSetUp)

TestCaseTest("testRunning").run()
TestCaseTest("testSetUp").run()
